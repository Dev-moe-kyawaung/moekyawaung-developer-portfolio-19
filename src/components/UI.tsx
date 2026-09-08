import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing, shadowFor } from '../theme';
import { CALM } from './Motion';

export function Card({
  children,
  style,
  tone = 'surface',
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'surface' | 'alt' | 'high';
}) {
  const { palette } = useTheme();
  const bg =
    tone === 'alt' ? palette.surfaceAlt : tone === 'high' ? palette.surfaceHigh : palette.surface;
  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.border,
        },
        shadowFor(palette),
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const { palette } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        {!!eyebrow && (
          <Text style={[styles.eyebrow, { color: palette.accent }]}>{eyebrow}</Text>
        )}
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{title}</Text>
      </View>
      {!!action && (
        <Pressable onPress={onAction} hitSlop={10} style={styles.actionBtn}>
          <Text style={[styles.action, { color: palette.accent }]}>{action}</Text>
          <Ionicons name="arrow-forward" size={13} color={palette.accent} />
        </Pressable>
      )}
    </View>
  );
}

export function Chip({
  label,
  active = false,
  onPress,
  accent,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  accent?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const { palette } = useTheme();
  const tint = accent ?? palette.accent;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? tint : palette.surfaceAlt,
          borderColor: active ? tint : palette.border,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
    >
      {!!icon && (
        <Ionicons
          name={icon}
          size={13}
          color={active ? palette.onAccent : palette.textDim}
          style={{ marginRight: 6 }}
        />
      )}
      <Text
        style={[
          styles.chipText,
          { color: active ? palette.onAccent : palette.textDim },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Pill({
  icon,
  children,
  color,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  color?: string;
}) {
  const { palette } = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: palette.surfaceAlt, borderColor: palette.borderSoft }]}>
      {!!icon && <Ionicons name={icon} size={12} color={color ?? palette.textDim} style={{ marginRight: 5 }} />}
      <Text style={[styles.pillText, { color: color ?? palette.textDim }]}>{children}</Text>
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const { palette } = useTheme();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: palette.border }, style]} />;
}

export function Spinner({ size = 26 }: { size?: number }) {
  const { palette } = useTheme();
  return <ActivityIndicator size="small" color={palette.accent} style={{ height: size * 2 }} />;
}

export function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { palette } = useTheme();
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [pulse]);
  const s = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={styles.empty}>
      <Animated.View style={s}>
        <View
          style={[
            styles.emptyIcon,
            { backgroundColor: palette.accentSoft, borderColor: palette.borderSoft },
          ]}
        >
          <Ionicons name={icon} size={30} color={palette.accent} />
        </View>
      </Animated.View>
      <Text style={[styles.emptyTitle, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: palette.textDim }]}>{body}</Text>
      {!!actionLabel && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.emptyBtn,
            { backgroundColor: palette.accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.emptyBtnText, { color: palette.onAccent }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

/** A bar that draws itself to a percentage — used across skills and stats. */
export function Meter({
  value,
  color,
  delay = 0,
}: {
  value: number;
  color: string;
  delay?: number;
}) {
  const { palette } = useTheme();
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(Math.max(0, Math.min(100, value)), {
      duration: 1100,
      easing: CALM,
    });
  }, [value, w]);
  const s = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={[styles.meterTrack, { backgroundColor: palette.surfaceAlt }]}>
      <Animated.View style={[styles.meterFill, { backgroundColor: color }, s]} />
    </View>
  );
}

export function Badge({
  label,
  color,
  style,
}: {
  label: string;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  const { palette } = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
      <Text style={[styles.badgeText, { color }, style]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 5,
  },
  sectionTitle: { fontSize: 23, fontWeight: '600', letterSpacing: -0.5 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: 4 },
  action: { fontSize: 13, fontWeight: '700' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pillText: { fontSize: 11, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 52, paddingHorizontal: 28 },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 18,
  },
  emptyTitle: { fontSize: 17, fontWeight: '600', marginBottom: 7, textAlign: 'center' },
  emptyBody: { fontSize: 13.5, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: radius.pill,
  },
  emptyBtnText: { fontSize: 13.5, fontWeight: '700' },
  meterTrack: {
    height: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
    width: '100%',
  },
  meterFill: { height: '100%', borderRadius: radius.pill },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badgeText: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.3 },
});
