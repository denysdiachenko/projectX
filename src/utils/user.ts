import type { User } from '@supabase/supabase-js';

export function getUserDisplayName(user: User | null, fallback: string) {
  const metadataName = user?.user_metadata.full_name ?? user?.user_metadata.name;

  if (typeof metadataName === 'string' && metadataName.trim()) {
    return metadataName.trim();
  }

  const emailName = user?.email?.split('@')[0]?.trim();
  return emailName || fallback;
}

export function getUserInitial(displayName: string) {
  return displayName.trim().charAt(0).toLocaleUpperCase() || '?';
}
