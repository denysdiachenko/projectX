import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo, type ComponentProps } from 'react';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import { createEventPlanStyles } from './styles';

type EventTabPlaceholderProps = {
  icon: ComponentProps<typeof AntDesign>['name'];
  message: string;
  title: string;
};

export default function EventTabPlaceholder({
  icon,
  message,
  title,
}: EventTabPlaceholderProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createEventPlanStyles(theme), [theme]);

  return (
    <View style={[styles.screen, styles.state]}>
      <View style={styles.placeholderIcon}>
        <AntDesign name={icon} color={theme.colors.text.brand} size={28} />
      </View>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}
