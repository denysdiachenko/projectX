import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text } from 'react-native';

import createStyles from '@/components/AppStackHeader/styles';
import { ROUTES } from '@/constants/routes';
import { useAppAuth } from '@/hooks/app-auth';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { getAvatarUri, getUserProfile, type UserProfile } from '@/services/profile';
import { getUserInitial } from '@/utils/user';

export default function ProfileHeaderAction() {
  const router = useRouter();
  const { user } = useAppAuth();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setProfile(null);
        return;
      }

      let active = true;

      void getUserProfile(user.id)
        .then((nextProfile) => {
          if (active) {
            setProfile(nextProfile);
          }
        })
        .catch(() => {
          if (active) {
            setProfile(null);
          }
        });

      return () => {
        active = false;
      };
    }, [user]),
  );

  const avatarUri = getAvatarUri(profile?.avatar_url);
  const initialSource =
    profile?.display_name?.trim() || user?.email?.trim() || translations.myEvents.defaultName;

  return (
    <Pressable
      accessibilityLabel={translations.myEvents.openProfile}
      accessibilityRole="button"
      onPress={() => router.push(ROUTES.profile)}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      {avatarUri ? (
        <Image contentFit="cover" source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <Text style={styles.initial}>{getUserInitial(initialSource)}</Text>
      )}
    </Pressable>
  );
}
