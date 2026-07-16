import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

const jsonResponse = (body: Record<string, unknown>, status: number) =>
  Response.json(body, { status, headers: corsHeaders });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'DELETE') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const authorization = request.headers.get('Authorization');

  if (!authorization) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const publishableKey = Deno.env.get('SUPABASE_ANON_KEY');
  const secretKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !publishableKey || !secretKey) {
    console.error('Required Supabase function environment variables are missing.');
    return jsonResponse({ error: 'Server configuration error' }, 500);
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: avatarObjects, error: listAvatarError } = await adminClient.storage
    .from('avatars')
    .list(user.id, { limit: 100 });

  if (listAvatarError) {
    console.error('Failed to list account avatars.', listAvatarError);
    return jsonResponse({ error: 'Unable to delete account data' }, 500);
  }

  if (avatarObjects.length > 0) {
    const avatarPaths = avatarObjects.map((object) => `${user.id}/${object.name}`);
    const { error: deleteAvatarError } = await adminClient.storage
      .from('avatars')
      .remove(avatarPaths);

    if (deleteAvatarError) {
      console.error('Failed to delete account avatars.', deleteAvatarError);
      return jsonResponse({ error: 'Unable to delete account data' }, 500);
    }
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error('Failed to delete account.', deleteError);
    return jsonResponse({ error: 'Unable to delete account' }, 500);
  }

  return jsonResponse({ deleted: true }, 200);
});
