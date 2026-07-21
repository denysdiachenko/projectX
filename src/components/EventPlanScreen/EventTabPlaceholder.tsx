import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createEventPlanStyles } from './styles';

type EventTabPlaceholderProps = {
  icon: 'shopping-cart' | 'check-square';
};

export default function EventTabPlaceholder({ icon }: EventTabPlaceholderProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createEventPlanStyles(theme), [theme]);

  return (
    <View style={[styles.screen, styles.state]}>
      <View style={styles.placeholderIcon}>
        <AntDesign name={icon} color={theme.colors.text.brand} size={28} />
      </View>
      <Text style={styles.placeholderTitle}>{translations.eventPlan.unavailableTitle}</Text>
      <Text style={styles.errorText}>{translations.eventPlan.unavailableMessage}</Text>
    </View>
  );
}
