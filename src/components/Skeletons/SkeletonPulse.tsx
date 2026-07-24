import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import {
  AccessibilityInfo,
  Animated,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import { createSkeletonStyles } from './styles';

type SkeletonPulseProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export default function SkeletonPulse({ children, style }: SkeletonPulseProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createSkeletonStyles(theme), [theme]);
  const [opacity] = useState(() => new Animated.Value(0.5));
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    opacity.stopAnimation();

    if (reduceMotion) {
      opacity.setValue(0.72);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          duration: 750,
          toValue: 0.92,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 750,
          toValue: 0.5,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity, reduceMotion]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.pulse, { opacity }, style]}>
      {children}
    </Animated.View>
  );
}
