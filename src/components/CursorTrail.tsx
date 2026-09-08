import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Platform, View, Dimensions, GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  interpolate,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { CALM } from './Motion';

/**
 * Animated cursor effect.
 *
 * A soft luminous ring with a five-dot comet trail eases toward wherever the
 * pointer last was, plus a slow expanding ripple on press. On a device with a
 * real pointer (web) it acts as a replacement cursor — a document-level
 * `mousemove` drives it and the native cursor is hidden over the app. On touch
 * it becomes a fingertip glow.
 *
 * Tracking is deliberately non-intercepting. Rather than a gesture recognizer
 * that would compete with — and could starve — every ScrollView in the app,
 * the handlers are bubble-phase `onTouchStart`/`onTouchMove`/`onTouchEnd`
 * listeners attached to the app's root view. Those fire *after* the view that
 * owns the responder has handled the event, so scrolling, taps, the tab bar
 * and modals keep working completely untouched.
 */

const DOT_COUNT = 5;
const { width: W, height: H } = Dimensions.get('window');

export type CursorState = {
  handlers: {
    onTouchStart: (e: GestureResponderEvent) => void;
    onTouchMove: (e: GestureResponderEvent) => void;
    onTouchEnd: () => void;
  };
  x: SharedValue<number>;
  y: SharedValue<number>;
  active: SharedValue<number>;
  press: SharedValue<number>;
  ripple: SharedValue<number>;
  dots: { px: SharedValue<number>; py: SharedValue<number> }[];
  hasPointer: boolean;
};

/** Owns all cursor motion state and returns non-intercepting touch handlers. */
export function useCursor(): CursorState {
  const x = useSharedValue(W / 2);
  const y = useSharedValue(H / 2);
  const active = useSharedValue(0);
  const press = useSharedValue(0);
  const ripple = useSharedValue(0);

  const d0x = useSharedValue(W / 2);
  const d0y = useSharedValue(H / 2);
  const d1x = useSharedValue(W / 2);
  const d1y = useSharedValue(H / 2);
  const d2x = useSharedValue(W / 2);
  const d2y = useSharedValue(H / 2);
  const d3x = useSharedValue(W / 2);
  const d3y = useSharedValue(H / 2);
  const d4x = useSharedValue(W / 2);
  const d4y = useSharedValue(H / 2);

  const dots = useMemo(
    () => [
      { px: d0x, py: d0y },
      { px: d1x, py: d1y },
      { px: d2x, py: d2y },
      { px: d3x, py: d3y },
      { px: d4x, py: d4y },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const hasPointer = useMemo(() => {
    if (Platform.OS !== 'web') return false;
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia('(pointer: fine)').matches;
  }, []);

  const moveTo = useCallback((nx: number, ny: number) => {
    'worklet';
    x.value = withSpring(nx, { damping: 26, stiffness: 210, mass: 0.35 });
    y.value = withSpring(ny, { damping: 26, stiffness: 210, mass: 0.35 });

    let leadX = x;
    let leadY = y;
    for (let i = 0; i < DOT_COUNT; i++) {
      const damping = 20 - i * 1.8;
      const stiffness = 160 - i * 18;
      dots[i].px.value = withSpring(leadX.value, { damping, stiffness, mass: 0.5 });
      dots[i].py.value = withSpring(leadY.value, { damping, stiffness, mass: 0.5 });
      leadX = dots[i].px;
      leadY = dots[i].py;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTouchStart = useCallback(
    (e: GestureResponderEvent) => {
      const { pageX, pageY } = e.nativeEvent;
      active.value = withTiming(1, { duration: 220, easing: CALM });
      x.value = pageX;
      y.value = pageY;
      for (let i = 0; i < DOT_COUNT; i++) {
        dots[i].px.value = pageX;
        dots[i].py.value = pageY;
      }
      ripple.value = 0;
      ripple.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
      press.value = withTiming(1, { duration: 200, easing: CALM });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onTouchMove = useCallback(
    (e: GestureResponderEvent) => {
      moveTo(e.nativeEvent.pageX, e.nativeEvent.pageY);
    },
    [moveTo],
  );

  const onTouchEnd = useCallback(() => {
    press.value = withTiming(0, { duration: 420, easing: CALM });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real pointer: drive from the document and hide the native cursor.
  useEffect(() => {
    if (!hasPointer || typeof document === 'undefined') return;
    const el = document.documentElement;
    const move = (e: MouseEvent) => {
      'worklet';
      moveTo(e.clientX, e.clientY);
    };
    const enter = () => {
      active.value = withTiming(1, { duration: 400, easing: CALM });
    };
    const leave = () => {
      active.value = withTiming(0, { duration: 400, easing: CALM });
    };
    const down = () => {
      ripple.value = 0;
      ripple.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
      press.value = withSequence(
        withTiming(1, { duration: 180 }),
        withTiming(0, { duration: 460, easing: CALM }),
      );
    };
    el.addEventListener('mousemove', move as unknown as EventListener);
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('mousedown', down);

    const style = document.createElement('style');
    style.textContent = '[data-cursor-surface="true"] *{cursor:none !important;}';
    document.head.appendChild(style);

    return () => {
      el.removeEventListener('mousemove', move as unknown as EventListener);
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      el.removeEventListener('mousedown', down);
      style.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPointer]);

  return {
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    x,
    y,
    active,
    press,
    ripple,
    dots,
    hasPointer,
  };
}

function TrailDot({
  px,
  py,
  size,
  color,
  fade,
  factor,
}: {
  px: SharedValue<number>;
  py: SharedValue<number>;
  size: number;
  color: string;
  fade: SharedValue<number>;
  factor: number;
}) {
  const s = useAnimatedStyle(() => ({
    opacity: fade.value * factor,
    transform: [{ translateX: px.value }, { translateY: py.value }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.dot, { width: size, height: size, backgroundColor: color }, s]}
    />
  );
}

/** Purely visual layer. Renders nothing that can intercept a touch. */
export default function CursorLayer({ cursor }: { cursor: CursorState }) {
  const { palette, isDark } = useTheme();
  const tint = palette.accent;
  const core = isDark ? '#FFF6E6' : '#2A1D0C';

  const ringStyle = useAnimatedStyle(() => ({
    opacity: cursor.active.value * 0.9,
    transform: [
      { translateX: cursor.x.value },
      { translateY: cursor.y.value },
      { scale: interpolate(cursor.press.value, [0, 1], [1, 0.62]) },
    ],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity:
      cursor.active.value * interpolate(cursor.press.value, [0, 1], [0.42, 0.9]),
    transform: [
      { translateX: cursor.x.value },
      { translateY: cursor.y.value },
      { scale: interpolate(cursor.press.value, [0, 1], [1, 1.9]) },
    ],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: (1 - cursor.ripple.value) * cursor.active.value * 0.55,
    transform: [
      { translateX: cursor.x.value },
      { translateY: cursor.y.value },
      { scale: interpolate(cursor.ripple.value, [0, 1], [0.2, 3.4]) },
    ],
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {cursor.dots.map((d, i) => (
        <TrailDot
          key={`dot-${i}`}
          px={d.px}
          py={d.py}
          size={15 - i * 2}
          color={tint}
          fade={cursor.active}
          factor={0.32 - i * 0.05}
        />
      ))}
      <Animated.View style={[styles.halo, { backgroundColor: tint }, haloStyle]} />
      <Animated.View style={[styles.ripple, { borderColor: tint }, rippleStyle]} />
      <Animated.View style={[styles.ring, { borderColor: tint, backgroundColor: core }, ringStyle]}>
        <View style={[styles.core, { backgroundColor: tint }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: -7.5,
    marginTop: -7.5,
    borderRadius: 999,
    opacity: 0,
  },
  halo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    marginLeft: -60,
    marginTop: -60,
    borderRadius: 999,
    opacity: 0,
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 26,
    height: 26,
    marginLeft: -13,
    marginTop: -13,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  core: { width: 4, height: 4, borderRadius: 999 },
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
    borderRadius: 999,
    borderWidth: 1.5,
    opacity: 0,
  },
});
