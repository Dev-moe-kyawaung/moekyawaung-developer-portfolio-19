import React, { useEffect } from 'react';
import { StyleProp, ViewStyle, View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { cinematic } from '../theme';

/**
 * The house easing curve: a long, gentle S-curve. Nothing snaps.
 */
export const CALM = Easing.bezier(0.16, 0.84, 0.28, 1);
export const DRIFT = Easing.bezier(0.32, 0.72, 0, 1);

export const fadeUp = (
  progress: SharedValue<number>,
  distance = 26,
) => {
  'worklet';
  return {
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * distance },
      { scale: interpolate(progress.value, [0, 1], [0.97, 1], Extrapolation.CLAMP) },
    ],
  };
};

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

/**
 * Fades and drifts its children in from below with a soft settle.
 * `disabled` renders children immediately (reduced-motion path).
 */
export function Reveal({
  children,
  delay = 0,
  distance = 26,
  duration = cinematic.duration,
  style,
  disabled = false,
}: RevealProps) {
  const progress = useSharedValue(disabled ? 1 : 0);

  useEffect(() => {
    if (disabled) {
      progress.value = 1;
      return;
    }
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: CALM }),
    );
  }, [delay, duration, disabled, progress]);

  const animated = useAnimatedStyle(() => fadeUp(progress, distance));

  if (disabled) return <View style={style}>{children}</View>;
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}

type FadeProps = {
  children: React.ReactNode;
  visible: boolean;
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

export function CrossFade({ children, visible, duration = 420, style }: FadeProps) {
  const o = useSharedValue(visible ? 1 : 0);
  useEffect(() => {
    o.value = withTiming(visible ? 1 : 0, { duration, easing: CALM });
  }, [visible, duration, o]);
  const s = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[style, s]}>{children}</Animated.View>;
}

/**
 * A slow, continuous ambient drift used behind hero surfaces — the
 * "breathing" of the cinematic background. Paused when `paused` is true.
 */
export function Breath({
  children,
  paused = false,
}: {
  children: React.ReactNode;
  paused?: boolean;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (paused) return;
    t.value = withTiming(1, {
      duration: 9000,
      easing: Easing.inOut(Easing.quad),
    });
  }, [paused, t]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(t.value, [0, 1], [0, -10]) }],
    opacity: interpolate(t.value, [0, 1], [0.75, 1]),
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

export function Pressable3D({
  children,
  style,
  onPress,
  onPressIn,
  disabled,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onPressIn?: () => void;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 1,
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <Animated.View style={[style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            left: -1,
            right: -1,
            top: -1,
            bottom: -1,
            borderRadius: 999,
          },
          glowStyle,
        ]}
      />
      <Animated.View
        onTouchStart={() => {
          if (disabled) return;
          scale.value = withTiming(0.965, { duration: 160, easing: CALM });
          onPressIn?.();
        }}
        onTouchEnd={() => {
          if (disabled) return;
          scale.value = withSpring(1, { damping: 16, stiffness: 220 });
          onPress && runOnJS(onPress)();
        }}
        style={animated}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

/**
 * Maps a scroll offset into a 0..1 progress value, used for parallax headers.
 */
export function useParallaxStyle(
  scrollY: SharedValue<number>,
  range = 220,
) {
  return useAnimatedStyle(() => {
    'worklet';
    const y = scrollY.value;
    return {
      transform: [
        { translateY: interpolate(y, [0, range], [0, range * 0.45], Extrapolation.CLAMP) },
        { scale: interpolate(y, [0, range], [1, 1.12], Extrapolation.CLAMP) },
      ],
      opacity: interpolate(y, [0, range * 1.4], [1, 0.25], Extrapolation.CLAMP),
    };
  });
}

export function measure(node: LayoutChangeEvent) {
  return node.nativeEvent.layout;
}
