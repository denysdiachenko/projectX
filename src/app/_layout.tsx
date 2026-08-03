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
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppToast from '@/components/AppToast/AppToast';
import { AppAuthProvider, useAppAuth } from '@/hooks/app-auth';
import { AppLocalizationProvider } from '@/hooks/app-localization';
import { AppThemeProvider } from '@/hooks/app-theme';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoading } = useAppAuth();

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
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
    <GestureHandlerRootView>
      <AppAuthProvider>
        <AppThemeProvider>
          <AppLocalizationProvider>
            <RootNavigator />
          </AppLocalizationProvider>
        </AppThemeProvider>
      </AppAuthProvider>
    </GestureHandlerRootView>
  );
}
