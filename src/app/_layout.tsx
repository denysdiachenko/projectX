import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import AppHeaderBackButton from '@/components/AppStackHeader/AppHeaderBackButton';
import ProfileHeaderAction from '@/components/AppStackHeader/ProfileHeaderAction';
import AppToast from '@/components/AppToast/AppToast';
import { AppAuthProvider, useAppAuth } from '@/hooks/app-auth';
import { AppLocalizationProvider, useAppLocalization } from '@/hooks/app-localization';
import { AppThemeProvider, useAppTheme } from '@/hooks/app-theme';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoading, session } = useAppAuth();
  const { translations } = useAppLocalization();
  const theme = useAppTheme();

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  const isAuthenticated = Boolean(session);
  const profileHeaderOptions = (title: string) => ({
    headerLeft: () => <AppHeaderBackButton />,
    headerShadowVisible: false,
    headerShown: true,
    headerStyle: { backgroundColor: theme.colors.background.canvas },
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
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
        </Stack.Protected>
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
      <AppToast />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppThemeProvider>
      <AppLocalizationProvider>
        <AppAuthProvider>
          <RootNavigator />
        </AppAuthProvider>
      </AppLocalizationProvider>
    </AppThemeProvider>
  );
}
