import { useMemo } from 'react';
import { View } from 'react-native';
import Toast, {
  type ToastConfig,
  type ToastConfigParams,
} from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppAlert, { type AppAlertVariant } from '@/components/AppAlert/AppAlert';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import createStyles from './styles';

function renderToast(
  variant: AppAlertVariant,
  dismissLabel: string,
  styles: ReturnType<typeof createStyles>,
) {
  return function ToastContent({ text1, text2, hide }: ToastConfigParams<unknown>) {
    return (
      <View style={styles.wrapper}>
        <AppAlert
          dismissLabel={dismissLabel}
          message={text2 ?? text1 ?? ''}
          onDismiss={hide}
          title={text2 ? text1 : undefined}
          variant={variant}
        />
      </View>
    );
  };
}

export default function AppToast() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const config = useMemo<ToastConfig>(
    () => ({
      success: renderToast('success', translations.common.dismiss, styles),
      error: renderToast('error', translations.common.dismiss, styles),
      info: renderToast('info', translations.common.dismiss, styles),
      warning: renderToast('warning', translations.common.dismiss, styles),
    }),
    [styles, translations.common.dismiss],
  );

  return (
    <Toast
      autoHide
      config={config}
      position="top"
      swipeable
      topOffset={insets.top + theme.spacing.x3}
      visibilityTime={4000}
    />
  );
}
