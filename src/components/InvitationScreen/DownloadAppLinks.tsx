import { AntDesign } from '@react-native-vector-icons/ant-design';
import * as Linking from 'expo-linking';
import { Platform, Text, View } from 'react-native';

import AppButton from '@/components/AppButton/AppButton';
import { useAppTheme } from '@/hooks/app-theme';

import type { createInvitationStyles } from './styles';

type DownloadAppLinksProps = {
  androidLabel: string;
  body: string;
  iosLabel: string;
  styles: ReturnType<typeof createInvitationStyles>;
  title: string;
};

export default function DownloadAppLinks({
  androidLabel,
  body,
  iosLabel,
  styles,
  title,
}: DownloadAppLinksProps) {
  const theme = useAppTheme();
  const iosUrl = process.env.EXPO_PUBLIC_IOS_APP_URL;
  const androidUrl = process.env.EXPO_PUBLIC_ANDROID_APP_URL;

  if (Platform.OS !== 'web' || (!iosUrl && !androidUrl)) return null;

  return (
    <View style={styles.downloadCard}>
      <View style={styles.downloadCopy}>
        <Text style={styles.downloadTitle}>{title}</Text>
        <Text style={styles.downloadBody}>{body}</Text>
      </View>
      <View style={styles.downloadActions}>
        {iosUrl ? (
          <AppButton
            icon={<AntDesign color={theme.colors.text.primary} name="apple" size={20} />}
            label={iosLabel}
            onPress={() => void Linking.openURL(iosUrl)}
            style={styles.downloadButton}
            variant="social"
          />
        ) : null}
        {androidUrl ? (
          <AppButton
            icon={<AntDesign color={theme.colors.text.primary} name="android" size={20} />}
            label={androidLabel}
            onPress={() => void Linking.openURL(androidUrl)}
            style={styles.downloadButton}
            variant="social"
          />
        ) : null}
      </View>
    </View>
  );
}
