import Toast from 'react-native-toast-message';

import type { AppAlertVariant } from '@/components/AppAlert/AppAlert';

type ShowToastOptions = {
  message: string;
  title?: string;
  type?: AppAlertVariant;
  visibilityTime?: number;
};

export function showToast({
  message,
  title,
  type = 'info',
  visibilityTime,
}: ShowToastOptions) {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime,
  });
}

export function hideToast() {
  Toast.hide();
}
