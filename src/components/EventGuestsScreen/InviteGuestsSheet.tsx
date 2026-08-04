import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { ActivityIndicator, Animated, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBottomSheetAnimation } from '@/components/EventManagement/useBottomSheetAnimation';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createEventGuestsStyles } from './styles';

type InviteGuestsSheetProps = {
  loading: boolean;
  onClose: () => void;
  onOpenQr: () => void;
  onShare: () => void;
  visible: boolean;
};

export default function InviteGuestsSheet({
  loading,
  onClose,
  onOpenQr,
  onShare,
  visible,
}: InviteGuestsSheetProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const copy = useAppLocalization().translations.eventPlan.guests;
  const styles = useMemo(
    () => createEventGuestsStyles(theme, insets.bottom),
    [insets.bottom, theme],
  );
  const { backdropOpacity, sheetTranslateY } = useBottomSheetAnimation(visible);

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}>
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable onPress={onClose} style={styles.backdropPressable} />
        </Animated.View>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{copy.sheetTitle}</Text>
            <Pressable accessibilityLabel={copy.close} onPress={onClose} style={styles.closeButton}>
              <AntDesign color={theme.colors.text.primary} name="close" size={20} />
            </Pressable>
          </View>
          <Text style={styles.sheetMessage}>{copy.sheetMessage}</Text>
          <InviteOption
            accent="primary"
            description={copy.shareDescription}
            disabled={loading}
            icon="share-alt"
            loading={loading}
            onPress={onShare}
            styles={styles}
            theme={theme}
            title={copy.shareTitle}
          />
          <InviteOption
            accent="secondary"
            description={copy.qrDescription}
            disabled={loading}
            icon="qrcode"
            onPress={onOpenQr}
            styles={styles}
            theme={theme}
            title={copy.qrTitle}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

type InviteOptionProps = {
  accent: 'primary' | 'secondary';
  description: string;
  disabled: boolean;
  icon: 'qrcode' | 'share-alt';
  loading?: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createEventGuestsStyles>;
  theme: ReturnType<typeof useAppTheme>;
  title: string;
};

function InviteOption({
  accent,
  description,
  disabled,
  icon,
  loading,
  onPress,
  styles,
  theme,
  title,
}: InviteOptionProps) {
  const color = accent === 'primary'
    ? theme.colors.text.brand
    : theme.colors.background.accent;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        accent === 'primary' ? styles.optionPrimary : styles.optionAccent,
        disabled && styles.optionDisabled,
        pressed && { opacity: 0.72 },
      ]}>
      <View style={styles.optionIcon}>
        {loading ? (
          <ActivityIndicator color={color} size="small" />
        ) : (
          <AntDesign color={color} name={icon} size={20} />
        )}
      </View>
      <View style={styles.optionCopy}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </Pressable>
  );
}
