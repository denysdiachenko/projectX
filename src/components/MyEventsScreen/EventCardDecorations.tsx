import { useMemo } from 'react';
import { View } from 'react-native';

import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import { useAppTheme } from '@/hooks/app-theme';

type DecorationTone = 'accent' | 'brand' | 'info';

export default function EventCardDecorations({
  compact = false,
  tone,
}: {
  compact?: boolean;
  tone: DecorationTone;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const circleToneStyle = {
    accent: styles.eventDecorationAccent,
    brand: styles.eventDecorationBrand,
    info: styles.eventDecorationInfo,
  }[tone];

  return (
    <View pointerEvents="none" style={styles.eventDecorations}>
      <View
        style={[
          styles.eventDecorationCircle,
          compact && styles.eventDecorationCircleCompact,
          circleToneStyle,
        ]}
      />
      <View
        style={[
          styles.eventDecorationPill,
          compact && styles.eventDecorationPillCompact,
          circleToneStyle,
        ]}
      />
    </View>
  );
}
