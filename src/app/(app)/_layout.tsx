import { Stack } from 'expo-router';

import AppHeaderBackButton from '@/components/AppStackHeader/AppHeaderBackButton';
import ProfileHeaderAction from '@/components/AppStackHeader/ProfileHeaderAction';
import EventHeaderAction from '@/components/EventManagement/EventHeaderAction';
import { useAppAuth } from '@/hooks/app-auth';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

export default function AppLayout() {
  const { session } = useAppAuth();
  const { translations } = useAppLocalization();
  const theme = useAppTheme();
  const isAuthenticated = Boolean(session);
  const profileHeaderOptions = (title: string) => ({
    headerLeft: () => <AppHeaderBackButton />,
    headerShadowVisible: false,
    headerShown: true,
    headerStyle: { backgroundColor: theme.colors.background.surface },
    headerTintColor: theme.colors.text.primary,
    headerTitle: title,
    headerTitleAlign: 'center' as const,
    headerTitleStyle: {
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.semiBold,
      fontSize: theme.typography.titleMedium.fontSize,
    },
  });

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="create-account" />
        <Stack.Screen name="auth/email-confirmation" />
        <Stack.Screen name="auth/forgot-password" />
      </Stack.Protected>
      <Stack.Screen name="auth/callback" />
      <Stack.Screen name="auth/update-password" />
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name="my-events"
          options={{
            headerRight: () => <ProfileHeaderAction />,
            headerShadowVisible: false,
            headerShown: true,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitle: '',
            headerTransparent: true,
          }}
        />
        <Stack.Screen name="create-event" />
        <Stack.Screen name="edit-event/[eventId]" />
        <Stack.Screen
          name="events/[eventId]"
          options={{
            ...profileHeaderOptions(translations.eventPlan.headerTitle),
            headerRight: () => <EventHeaderAction />,
          }}
        />
        <Stack.Screen
          name="profile"
          options={profileHeaderOptions(translations.profile.title)}
        />
        <Stack.Screen
          name="edit-profile"
          options={profileHeaderOptions(translations.profile.editTitle)}
        />
        <Stack.Screen
          name="privacy-policy"
          options={profileHeaderOptions(translations.profile.privacyPolicy)}
        />
        <Stack.Screen
          name="terms"
          options={profileHeaderOptions(translations.profile.terms)}
        />
      </Stack.Protected>
    </Stack>
  );
}
