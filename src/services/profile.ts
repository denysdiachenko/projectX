import type { ImagePickerAsset } from 'expo-image-picker';

import { supabase } from '@/lib/supabase';
import type { SupportedLanguage } from '@/localization/types';
import type { Tables } from '@/types/database';

const AVATAR_BUCKET = 'avatars';
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

export type UserProfile = Tables<'profiles'>;

type SaveProfileInput = {
  userId: string;
  displayName: string;
  currentAvatarUrl: string | null;
  avatarAsset: ImagePickerAsset | null;
};

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, locale, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProfileLocale(userId: string, locale: SupportedLanguage) {
  const { error } = await supabase.from('profiles').update({ locale }).eq('id', userId);

  if (error) {
    throw error;
  }
}

export async function saveUserProfile({
  userId,
  displayName,
  currentAvatarUrl,
  avatarAsset,
}: SaveProfileInput) {
  const nextAvatarPath = avatarAsset ? await uploadAvatar(userId, avatarAsset) : null;
  const avatarUrl = nextAvatarPath ?? currentAvatarUrl;
  const { data, error } = await supabase
    .from('profiles')
    .update({ display_name: displayName.trim(), avatar_url: avatarUrl })
    .eq('id', userId)
    .select('id, display_name, avatar_url, locale, created_at, updated_at')
    .single();

  if (error) {
    if (nextAvatarPath) {
      await supabase.storage.from(AVATAR_BUCKET).remove([nextAvatarPath]);
    }

    throw error;
  }

  const previousAvatarPath = getOwnedAvatarPath(userId, currentAvatarUrl);

  if (nextAvatarPath && previousAvatarPath && previousAvatarPath !== nextAvatarPath) {
    await supabase.storage.from(AVATAR_BUCKET).remove([previousAvatarPath]);
  }

  return data;
}

export function getAvatarUri(avatarUrl: string | null | undefined) {
  if (!avatarUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(avatarUrl)) {
    return avatarUrl;
  }

  return supabase.storage.from(AVATAR_BUCKET).getPublicUrl(avatarUrl).data.publicUrl;
}

async function uploadAvatar(userId: string, asset: ImagePickerAsset) {
  if (asset.fileSize && asset.fileSize > MAX_AVATAR_SIZE) {
    throw new Error('avatar_file_too_large');
  }

  const contentType = resolveContentType(asset.mimeType);
  const extension = contentType.split('/')[1] === 'jpeg' ? 'jpg' : contentType.split('/')[1];
  const path = `${userId}/avatar-${Date.now()}.${extension}`;
  const arrayBuffer = await fetch(asset.uri).then((response) => response.arrayBuffer());
  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, arrayBuffer, {
    cacheControl: '3600',
    contentType,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return path;
}

function resolveContentType(mimeType: string | null | undefined) {
  if (mimeType === 'image/png' || mimeType === 'image/webp') {
    return mimeType;
  }

  return 'image/jpeg';
}

function getOwnedAvatarPath(userId: string, avatarUrl: string | null) {
  if (!avatarUrl || /^https?:\/\//i.test(avatarUrl)) {
    return null;
  }

  return avatarUrl.startsWith(`${userId}/`) ? avatarUrl : null;
}
