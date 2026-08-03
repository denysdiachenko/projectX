import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient, createUserClient } from '../_shared/supabase.ts';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ code: 'method_not_allowed' }, 405);
  }

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return jsonResponse({ code: 'unauthorized' }, 401);
  }

  try {
    const body = await request.json() as { eventId?: unknown };
    const eventId = typeof body.eventId === 'string' ? body.eventId : '';

    if (!UUID_PATTERN.test(eventId)) {
      return jsonResponse({ code: 'invalid_event_id' }, 400);
    }

    const userClient = createUserClient(authorization);
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return jsonResponse({ code: 'unauthorized' }, 401);
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient.rpc('ensure_open_event_invitation', {
      p_event_id: eventId,
      p_expires_in_days: 90,
      p_user_id: user.id,
    });

    if (error) {
      if (error.code === 'P0002') {
        return jsonResponse({ code: 'event_not_found' }, 404);
      }

      console.error('Unable to ensure event invitation.', error);
      return jsonResponse({ code: 'invitation_unavailable' }, 500);
    }

    const invitation = data?.[0];

    if (!invitation) {
      return jsonResponse({ code: 'invitation_unavailable' }, 500);
    }

    return jsonResponse({
      token: invitation.invitation_id,
      expiresAt: invitation.invitation_expires_at,
    });
  } catch (error) {
    console.error('Unexpected invitation admin error.', error);
    return jsonResponse({ code: 'invalid_request' }, 400);
  }
});
