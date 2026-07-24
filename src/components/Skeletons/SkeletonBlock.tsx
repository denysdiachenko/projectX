import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import { createSkeletonStyles } from './styles';

type SkeletonBlockProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export default function SkeletonBlock({ children, style }: SkeletonBlockProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);

  return <View style={[styles.block, style]}>{children}</View>;
}
