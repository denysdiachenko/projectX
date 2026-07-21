import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Animated, View, type ColorValue } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import { createShoppingTabIconStyles } from './shoppingTabIconStyles';

type ShoppingTabIconProps = {
  color: ColorValue;
  showEmptyAttention: boolean;
  size: number;
};

export default function ShoppingTabIcon({
  color,
  showEmptyAttention,
  size,
}: ShoppingTabIconProps) {
  const theme = useAppTheme();
  const [pulse] = useState(() => new Animated.Value(0));
  const [reduceMotion, setReduceMotion] = useState(false);
  const styles = useMemo(() => createShoppingTabIconStyles(theme, size), [size, theme]);
  const iconColor = showEmptyAttention ? theme.colors.status.errorForeground : color;

  useEffect(() => {
    let isActive = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((isEnabled) => {
      if (isActive) setReduceMotion(isEnabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);

    return () => {
      isActive = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    pulse.stopAnimation();
    pulse.setValue(0);

    if (!showEmptyAttention || reduceMotion) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse, reduceMotion, showEmptyAttention]);

  return (
    <View style={styles.container}>
      {showEmptyAttention && !reduceMotion ? (
        <Animated.View
          style={[
            styles.pulse,
            {
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.24, 0] }),
              transform: [{
                scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.6] }),
              }],
            },
          ]}
        />
      ) : null}
      <AntDesign color={iconColor} name="shopping-cart" size={size} />
    </View>
  );
}
