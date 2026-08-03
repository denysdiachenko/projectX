import { createClient } from 'npm:@supabase/supabase-js@2.110.6';

function getNamedKey(jsonName: string, legacyName: string) {
  const serializedKeys = Deno.env.get(jsonName);

  if (serializedKeys) {
    try {
      const keys = JSON.parse(serializedKeys) as Record<string, string>;
      const key = keys.default ?? Object.values(keys)[0];

      if (key) return key;
    } catch {
      // Fall back to the legacy environment variable below.
    }
  }

  return Deno.env.get(legacyName);
}

function getSupabaseUrl() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');

  if (!supabaseUrl) throw new Error('SUPABASE_URL is missing');
  return supabaseUrl;
}

export function createAdminClient() {
  const secretKey = getNamedKey('SUPABASE_SECRET_KEYS', 'SUPABASE_SERVICE_ROLE_KEY');

  if (!secretKey) throw new Error('Supabase secret key is missing');

  return createClient(getSupabaseUrl(), secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function createUserClient(authorization: string) {
  const publishableKey = getNamedKey(
    'SUPABASE_PUBLISHABLE_KEYS',
    'SUPABASE_ANON_KEY',
  );

  if (!publishableKey) throw new Error('Supabase publishable key is missing');

  return createClient(getSupabaseUrl(), publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: authorization } },
  });
}
