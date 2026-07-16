import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createDeleteAccountSheetStyles } from './deleteAccountSheetStyles';

type DeleteAccountSheetProps = {
  visible: boolean;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteAccountSheet({
  visible,
  deleting,
  onCancel,
  onConfirm,
}: DeleteAccountSheetProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.profile;
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [sheetTranslateY] = useState(() => new Animated.Value(48));
  const styles = useMemo(
    () => createDeleteAccountSheetStyles(theme, insets.bottom),
    [insets.bottom, theme],
  );

  useEffect(() => {
    if (!visible) {
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(48);
      return;
    }

    const animation = Animated.parallel([
      Animated.timing(backdropOpacity, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [backdropOpacity, sheetTranslateY, visible]);

  return (
    <Modal
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
      transparent
      visible={visible}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable
            accessibilityLabel={copy.deleteCancelAction}
            accessibilityRole="button"
            disabled={deleting}
            onPress={onCancel}
            style={styles.backdropPressable}
          />
        </Animated.View>
        <Animated.View
          accessibilityViewIsModal
          style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{copy.deleteConfirmTitle}</Text>
          <Text style={styles.body}>{copy.deleteConfirmMessage}</Text>
          <View style={styles.actions}>
            <AppButton
              disabled={deleting}
              label={deleting ? copy.deletingAccount : copy.deleteConfirmAction}
              loading={deleting}
              variant="destructive"
              onPress={onConfirm}
            />
            <AppButton
              disabled={deleting}
              label={copy.deleteCancelAction}
              variant="secondary"
              onPress={onCancel}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
