import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useEffect, useRef, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import ReanimatedSwipeable, {
  SwipeDirection,
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  FadeOutLeft,
  LinearTransition,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useAppTheme } from '@/hooks/app-theme';

import { createSwipeableItemRowStyles } from './styles';

const ACTION_WIDTH = 64;

type SwipeableItemRowProps = {
  animateSwipeHint?: boolean;
  children: ReactNode;
  completeAccessibilityLabel: string;
  containerStyle?: StyleProp<ViewStyle>;
  deleteAccessibilityLabel: string;
  isCompleted: boolean;
  onComplete: () => void;
  onDelete: () => void;
  onSwipeHintPlayed?: () => void;
};

export default function SwipeableItemRow({
  animateSwipeHint = false,
  children,
  completeAccessibilityLabel,
  containerStyle,
  deleteAccessibilityLabel,
  isCompleted,
  onComplete,
  onDelete,
  onSwipeHintPlayed,
}: SwipeableItemRowProps) {
  const theme = useAppTheme();
  const styles = createSwipeableItemRowStyles(theme);
  const swipeableRef = useRef<SwipeableMethods>(null);
  const isHintAnimation = useRef(false);
  const closeHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!animateSwipeHint) return;

    const openHintTimer = setTimeout(() => {
      isHintAnimation.current = true;
      swipeableRef.current?.openRight();
    }, 600);

    return () => {
      clearTimeout(openHintTimer);
      if (closeHintTimer.current) clearTimeout(closeHintTimer.current);
      if (nextHintTimer.current) clearTimeout(nextHintTimer.current);
    };
  }, [animateSwipeHint]);

  const renderDeleteAction = (
    _progress: SharedValue<number>,
    translation: SharedValue<number>,
    swipeable: SwipeableMethods,
  ) => (
    <DeleteAction
      accessibilityLabel={deleteAccessibilityLabel}
      swipeable={swipeable}
      translation={translation}
      onDelete={onDelete}
    />
  );
  const renderCompleteAction = (
    _progress: SharedValue<number>,
    translation: SharedValue<number>,
    swipeable: SwipeableMethods,
  ) => (
    <CompleteAction
      accessibilityLabel={completeAccessibilityLabel}
      isCompleted={isCompleted}
      swipeable={swipeable}
      translation={translation}
      onComplete={onComplete}
    />
  );
  const handleSwipeableOpen = (direction: SwipeDirection) => {
    if (isHintAnimation.current) {
      closeHintTimer.current = setTimeout(() => {
        swipeableRef.current?.close();

        if (direction === SwipeDirection.LEFT) {
          nextHintTimer.current = setTimeout(() => {
            swipeableRef.current?.openLeft();
          }, 400);
          return;
        }

        isHintAnimation.current = false;
        onSwipeHintPlayed?.();
      }, 700);
      return;
    }

    swipeableRef.current?.close();

    if (direction === SwipeDirection.LEFT) {
      onComplete();
    } else {
      onDelete();
    }
  };

  return (
    <Animated.View
      exiting={FadeOutLeft.duration(200)}
      layout={LinearTransition.duration(200)}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        childrenContainerStyle={styles.childrenContainer}
        containerStyle={[styles.container, containerStyle]}
        enableTrackpadTwoFingerGesture
        friction={2}
        leftThreshold={48}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableOpen={handleSwipeableOpen}
        renderLeftActions={renderDeleteAction}
        renderRightActions={renderCompleteAction}
        rightThreshold={48}>
        {children}
      </ReanimatedSwipeable>
    </Animated.View>
  );
}

type DeleteActionProps = {
  accessibilityLabel: string;
  onDelete: () => void;
  swipeable: SwipeableMethods;
  translation: SharedValue<number>;
};

function DeleteAction({
  accessibilityLabel,
  onDelete,
  swipeable,
  translation,
}: DeleteActionProps) {
  const theme = useAppTheme();
  const styles = createSwipeableItemRowStyles(theme);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translation.value - ACTION_WIDTH }],
  }));

  return (
    <Animated.View style={[styles.deleteActionContainer, animatedStyle]}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={() => {
          swipeable.close();
          onDelete();
        }}
        style={({ pressed }) => [
          styles.deleteAction,
          pressed && styles.deleteActionPressed,
        ]}>
        <AntDesign color={theme.colors.text.onSecondary} name="delete" size={22} />
      </Pressable>
    </Animated.View>
  );
}

type CompleteActionProps = {
  accessibilityLabel: string;
  isCompleted: boolean;
  onComplete: () => void;
  swipeable: SwipeableMethods;
  translation: SharedValue<number>;
};

function CompleteAction({
  accessibilityLabel,
  isCompleted,
  onComplete,
  swipeable,
  translation,
}: CompleteActionProps) {
  const theme = useAppTheme();
  const styles = createSwipeableItemRowStyles(theme);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translation.value + ACTION_WIDTH }],
  }));

  return (
    <Animated.View style={[styles.completeActionContainer, animatedStyle]}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={() => {
          swipeable.close();
          onComplete();
        }}
        style={({ pressed }) => [
          styles.completeAction,
          pressed && styles.actionPressed,
        ]}>
        <AntDesign
          color={theme.colors.text.onBrand}
          name={isCompleted ? 'undo' : 'check'}
          size={22}
        />
      </Pressable>
    </Animated.View>
  );
}
