import { StatusBar } from 'expo-status-bar';

import LegalPlaceholderScreen from '@/components/ProfileScreen/LegalPlaceholderScreen';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

export default function PrivacyPolicyScreen() {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.profile;

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <LegalPlaceholderScreen
        message={copy.privacyPlaceholderMessage}
        title={copy.privacyPlaceholderTitle}
      />
    </>
  );
}
