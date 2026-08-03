import type { FunctionsHttpError } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database';

export type EventGuest = Pick<
  Tables<'event_guests'>,
  | 'adults_count'
  | 'children_count'
  | 'created_at'
  | 'id'
  | 'name'
  | 'responded_at'
  | 'rsvp_status'
>;

export type PublicInvitation = {
  eventId: string;
  eventName: string;
  eventType: string;
  expiresAt: string;
  id: string;
  location: string | null;
  organizerName: string | null;
  startsAt: string;
  timeZone: string;
};

export type RsvpStatus = 'accepted' | 'declined' | 'maybe';

type InvitationErrorCode =
  | 'event_not_found'
  | 'invalid_response'
  | 'invitation_not_found'
  | 'invitation_unavailable'
  | 'response_failed'
  | 'response_limit_reached'
  | 'unknown';

export class InvitationError extends Error {
  constructor(readonly code: InvitationErrorCode) {
    super(code);
    this.name = 'InvitationError';
  }
}

export async function getEventGuests(eventId: string): Promise<EventGuest[]> {
  const { data, error } = await supabase
    .from('event_guests')
    .select(`
      id,
      name,
      adults_count,
      children_count,
      rsvp_status,
      responded_at,
      created_at
    `)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getEventGuestsScreenData(eventId: string) {
  const [guests, eventResult] = await Promise.all([
    getEventGuests(eventId),
    supabase.from('events').select('name').eq('id', eventId).single(),
  ]);

  if (eventResult.error) throw eventResult.error;

  return {
    eventName: eventResult.data.name,
    guests,
  };
}

export async function getOrCreateInvitation(eventId: string) {
  const { data, error } = await supabase.functions.invoke<{
    expiresAt: string;
    token: string;
  }>('event-invitation-admin', {
    body: { eventId },
  });

  if (error || !data?.token) throw await toInvitationError(error);

  return {
    expiresAt: data.expiresAt,
    token: data.token,
    url: buildInvitationUrl(data.token),
  };
}

export async function getPublicInvitation(token: string): Promise<PublicInvitation> {
  const { data, error } = await supabase.functions.invoke<{
    invitation: PublicInvitation;
  }>('event-rsvp', {
    body: { action: 'details', token },
  });

  if (error || !data?.invitation) throw await toInvitationError(error);
  return data.invitation;
}

export async function submitInvitationResponse(input: {
  adultsCount: number;
  childrenCount: number;
  name: string;
  responseKey: string;
  status: RsvpStatus;
  token: string;
}) {
  const { data, error } = await supabase.functions.invoke<{ guestId: string }>(
    'event-rsvp',
    {
      body: { action: 'respond', ...input },
    },
  );

  if (error || !data?.guestId) throw await toInvitationError(error);
  return data.guestId;
}

export function buildInvitationUrl(token: string) {
  const baseUrl = process.env.EXPO_PUBLIC_INVITATION_WEB_URL?.replace(/\/+$/, '');

  if (!baseUrl) {
    throw new InvitationError('invitation_unavailable');
  }

  return `${baseUrl}/${encodeURIComponent(token)}`;
}

export function createResponseKey() {
  const randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto);

  if (randomUUID) return randomUUID();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

async function toInvitationError(error: FunctionsHttpError | Error | null) {
  if (!error) return new InvitationError('unknown');

  if ('context' in error && error.context instanceof Response) {
    try {
      const body = await error.context.json() as { code?: InvitationErrorCode };
      return new InvitationError(body.code ?? 'unknown');
    } catch {
      return new InvitationError('unknown');
    }
  }

  return new InvitationError('unknown');
}
