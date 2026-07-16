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

import AppToast from '@/components/AppToast/AppToast';
import { AppAuthProvider, useAppAuth } from '@/hooks/app-auth';
import { AppLocalizationProvider } from '@/hooks/app-localization';
import { AppThemeProvider } from '@/hooks/app-theme';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoading, session } = useAppAuth();

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  const isAuthenticated = Boolean(session);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="my-events" />
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
