import { AntDesign } from '@react-native-vector-icons/ant-design';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Modal, Pressable, Share, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  initialWindowMetrics,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { showToast } from '@/services/toast';

import { createEventGuestsStyles } from './styles';

type InvitationQrModalProps = {
  eventName: string;
  onClose: () => void;
  url: string | null;
  visible: boolean;
};

export default function InvitationQrModal({
  eventName,
  onClose,
  url,
  visible,
}: InvitationQrModalProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    initialWindowMetrics?.insets.top ?? 0,
  );
  const copy = useAppLocalization().translations.eventPlan.guests;
  const styles = useMemo(
    () => createEventGuestsStyles(theme, insets.bottom, topInset),
    [insets.bottom, theme, topInset],
  );

  if (!url) return null;

  const share = async () => {
    await Share.share({ message: `${interpolate(copy.shareMessage, { eventName })}\n${url}` });
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(url);
    showToast({
      message: copy.copiedMessage,
      title: copy.copiedTitle,
      type: 'success',
    });
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} visible={visible}>
      <SafeAreaView edges={['left', 'right']} style={styles.qrScreen}>
        <StatusBar style={theme.statusBar} />
        <View style={styles.qrHeader}>
          <Pressable accessibilityLabel={copy.close} onPress={onClose} style={styles.closeButton}>
            <AntDesign color={theme.colors.text.primary} name="left" size={22} />
          </Pressable>
          <Text style={styles.qrHeaderTitle}>{copy.qrScreenTitle}</Text>
          <View style={styles.closeButton} />
        </View>
        <View style={styles.qrContent}>
          <Text style={styles.qrTitle}>{copy.qrScreenTitle}</Text>
          <Text style={styles.qrDescription}>{copy.qrScreenDescription}</Text>
          <View style={styles.qrCard}>
            <QRCode
              backgroundColor="#FFFFFF"
              color="#21283B"
              quietZone={4}
              size={220}
              value={url}
            />
          </View>
          <Text style={styles.qrHint}>{copy.qrScanHint}</Text>
          <View style={styles.qrActions}>
            <AppButton label={copy.shareInvitation} onPress={() => void share()} />
            <AppButton label={copy.copyLink} onPress={() => void copyLink()} variant="social" />
          </View>
          <View style={styles.qrNote}>
            <Text style={styles.qrNoteText}>{copy.sameInvitationNote}</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function interpolate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template,
  );
}
