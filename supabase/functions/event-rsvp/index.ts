import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient, createUserClient } from '../_shared/supabase.ts';

type DetailsRequest = {
  action: 'details';
  token: string;
};

type RespondRequest = {
  action: 'respond';
  token: string;
  responseKey: string;
  name: string;
  adultsCount: number;
  childrenCount: number;
  status: 'accepted' | 'maybe' | 'declined';
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isDetailsRequest(body: unknown): body is DetailsRequest {
  if (!body || typeof body !== 'object') return false;

  const request = body as Partial<DetailsRequest>;
  return request.action === 'details'
    && typeof request.token === 'string'
    && UUID_PATTERN.test(request.token);
}

function isRespondRequest(body: unknown): body is RespondRequest {
  if (!body || typeof body !== 'object') return false;

  const request = body as Partial<RespondRequest>;
  const statusIsValid = request.status === 'accepted'
    || request.status === 'maybe'
    || request.status === 'declined';

  return request.action === 'respond'
    && typeof request.token === 'string'
    && UUID_PATTERN.test(request.token)
    && typeof request.responseKey === 'string'
    && UUID_PATTERN.test(request.responseKey)
    && typeof request.name === 'string'
    && request.name.trim().length >= 1
    && request.name.trim().length <= 120
    && Number.isInteger(request.adultsCount)
    && Number.isInteger(request.childrenCount)
    && Number(request.adultsCount) >= 0
    && Number(request.childrenCount) >= 0
    && Number(request.adultsCount) + Number(request.childrenCount) >= 1
    && Number(request.adultsCount) + Number(request.childrenCount) <= 20
    && statusIsValid;
}

async function getOptionalProfileId(request: Request) {
  const authorization = request.headers.get('Authorization');

  if (!authorization) return null;

  const userClient = createUserClient(authorization);
  const {
    data: { user },
    error,
  } = await userClient.auth.getUser();

  return error ? null : user?.id ?? null;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ code: 'method_not_allowed' }, 405);
  }

  try {
    const body: unknown = await request.json();
    const adminClient = createAdminClient();

    if (isDetailsRequest(body)) {
      const { data, error } = await adminClient.rpc('get_event_invitation_by_token', {
        p_token: body.token,
      });

      if (error) {
        console.error('Unable to load invitation.', error);
        return jsonResponse({ code: 'invitation_unavailable' }, 500);
      }

      const invitation = data?.[0];

      if (!invitation) {
        return jsonResponse({ code: 'invitation_not_found' }, 404);
      }

      return jsonResponse({
        invitation: {
          id: invitation.invitation_id,
          eventId: invitation.event_id,
          eventName: invitation.event_name,
          eventType: invitation.event_type,
          startsAt: invitation.starts_at,
          timeZone: invitation.time_zone,
          location: invitation.location_text,
          organizerName: invitation.organizer_name,
          expiresAt: invitation.expires_at,
        },
      });
    }

    if (isRespondRequest(body)) {
      const profileId = await getOptionalProfileId(request);
      const { data, error } = await adminClient.rpc(
        'submit_event_invitation_response',
        {
          p_adults_count: body.adultsCount,
          p_children_count: body.childrenCount,
          p_name: body.name,
          p_response_key: body.responseKey,
          p_rsvp_status: body.status,
          p_token: body.token,
          p_profile_id: profileId,
        },
      );

      if (error) {
        if (error.code === '22023') {
          return jsonResponse({ code: 'invalid_response' }, 400);
        }

        if (error.code === 'P0002') {
          return jsonResponse({ code: 'invitation_not_found' }, 404);
        }

        if (error.code === 'P0001') {
          return jsonResponse({ code: 'response_limit_reached' }, 409);
        }

        console.error('Unable to submit invitation response.', error);
        return jsonResponse({ code: 'response_failed' }, 500);
      }

      const response = data?.[0];

      if (!response) {
        return jsonResponse({ code: 'response_failed' }, 500);
      }

      return jsonResponse({
        eventId: response.response_event_id,
        guestId: response.response_guest_id,
        linkedToAccount: response.linked_to_profile,
      });
    }

    return jsonResponse({ code: 'invalid_action' }, 400);
  } catch (error) {
    console.error('Unexpected RSVP error.', error);
    return jsonResponse({ code: 'invalid_request' }, 400);
  }
});
