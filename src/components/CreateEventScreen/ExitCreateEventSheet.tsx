import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventSheetStyles } from './sheetStyles';

type ExitCreateEventSheetProps = {
  visible: boolean;
  copy?: {
    title: string;
    message: string;
    confirm: string;
    continue: string;
  };
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ExitCreateEventSheet({
  visible,
  copy,
  onCancel,
  onConfirm,
}: ExitCreateEventSheetProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const sheetCopy = copy ?? translations.createEvent.exit;
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [sheetTranslateY] = useState(() => new Animated.Value(48));
  const styles = useMemo(
    () => createCreateEventSheetStyles(theme, insets.bottom),
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
          <Pressable onPress={onCancel} style={styles.backdropPressable} />
        </Animated.View>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.centeredTitle}>{sheetCopy.title}</Text>
          <Text style={styles.centeredBody}>{sheetCopy.message}</Text>
          <View style={styles.actions}>
            <AppButton label={sheetCopy.confirm} variant="destructive" onPress={onConfirm} />
            <AppButton label={sheetCopy.continue} variant="secondary" onPress={onCancel} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
