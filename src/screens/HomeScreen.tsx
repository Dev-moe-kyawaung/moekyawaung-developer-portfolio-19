import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';

import { useTheme } from '../context/ThemeContext';
import { PROFILE, REPOS, STATS, HIGHLIGHTS, accentOf } from '../data/profile';
import { spacing, radius, cinematic, shadowFor } from '../theme';
import { Reveal, CALM } from '../components/Motion';
import { Card, SectionHeader, Pill, Badge } from '../components/UI';

const { height: SH } = Dimensions.get('window');

/** Slow-drifting light field behind the hero — the film grade of the app. */
function LightField({ paused }: { paused: boolean }) {
  const { palette } = useTheme();
  const a = useSharedValue(0);
  const b = useSharedValue(0);

  useEffect(() => {
    if (paused) return;
    a.value = withRepeat(
      withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    b.value = withRepeat(
      withTiming(1, { duration: 19000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [paused, a, b]);

  const sA = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(a.value, [0, 1], [-60, 70]) },
      { translateY: interpolate(a.value, [0, 1], [-20, 50]) },
      { scale: interpolate(a.value, [0, 1], [1, 1.22]) },
    ],
    opacity: interpolate(a.value, [0, 1], [0.45, 0.85]),
  }));
  const sB = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(b.value, [0, 1], [80, -50]) },
      { translateY: interpolate(b.value, [0, 1], [40, -30]) },
      { scale: interpolate(b.value, [0, 1], [1.15, 0.95]) },
    ],
    opacity: interpolate(b.value, [0, 1], [0.7, 0.35]),
  }));

  return (
    <View style={styles.lightWrap} pointerEvents="none">
      <Animated.View style={[styles.blob, { backgroundColor: palette.accent }, sA]} />
      <Animated.View style={[styles.blob, styles.blobB, { backgroundColor: palette.accentAlt }, sB]} />
      <Animated.View style={[styles.blob, styles.blobC, { backgroundColor: palette.sky }, sB]} />
    </View>
  );
}

/** A thin rule that sweeps across once on mount — a title-card wipe. */
function TitleWipe({ color }: { color: string }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(420, withTiming(1, { duration: cinematic.durationSlow, easing: CALM }));
  }, [w]);
  const s = useAnimatedStyle(() => ({ width: `${interpolate(w.value, [0, 1], [0, 100])}%` }));
  return <Animated.View style={[styles.wipe, { backgroundColor: color }, s]} />;
}

function StatBlock({
  label,
  value,
  suffix,
  note,
  index,
}: {
  label: string;
  value: number;
  suffix: string;
  note: string;
  index: number;
}) {
  const { palette } = useTheme();
  return (
    <Reveal delay={200 + index * cinematic.stagger} style={styles.statCol}>
      <CountUp to={value} delay={260 + index * cinematic.stagger} suffix={suffix} />
      <Text style={[styles.statLabel, { color: palette.text }]}>{label}</Text>
      <Text style={[styles.statNote, { color: palette.textFaint }]}>{note}</Text>
    </Reveal>
  );
}

function CountUp({ to, delay, suffix }: { to: number; delay: number; suffix: string }) {
  const { palette } = useTheme();
  const v = useSharedValue(0);
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    v.value = withDelay(delay, withTiming(to, { duration: 1600, easing: CALM }));
  }, [to, delay, v]);

  useAnimatedReaction(
    () => Math.round(v.value),
    (cur) => {
      runOnJS(setDisplay)(cur);
    },
  );

  return (
    <Text style={[styles.statValue, { color: palette.text }]}>
      {display}
      <Text style={{ color: palette.accent, fontSize: 18 }}>{suffix}</Text>
    </Text>
  );
}

function HighlightRow({ item, index }: { item: (typeof HIGHLIGHTS)[number]; index: number }) {
  const { palette } = useTheme();
  return (
    <Reveal delay={340 + index * 70} style={{ width: 216 }}>
      <Card tone="alt" style={styles.hlCard}>
        <View style={styles.hlTop}>
          <View style={[styles.hlIcon, { backgroundColor: palette.accentSoft }]}>
            <Ionicons name={item.icon as any} size={16} color={palette.accent} />
          </View>
          <Badge label={`★ ${item.stars}`} color={palette.accent} />
        </View>
        <Text style={[styles.hlLabel, { color: palette.text }]}>{item.label}</Text>
        <Text style={[styles.hlValue, { color: palette.accent }]}>{item.value}</Text>
        <Text style={[styles.hlNote, { color: palette.textDim }]} numberOfLines={3}>
          {item.note}
        </Text>
      </Card>
    </Reveal>
  );
}

export default function HomeScreen({ navigation }: any) {
  const { palette, isDark, mode, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const sy = useSharedValue(0);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(sy.value, [0, 300], [0, 60], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(sy.value, [0, 280], [1, 0.15], Extrapolation.CLAMP),
  }));

  const totalStars = useMemo(() => REPOS.reduce((n, r) => n + r.stars, 0), []);
  const featured = useMemo(() => REPOS.slice(0, 4), []);

  const onToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    toggle();
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.bg }]}>
      <LightField paused={!isDark} />
      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          sy.value = e.nativeEvent.contentOffset.y;
        }}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 120 }}
      >
        {/* top bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={[styles.brandDot, { backgroundColor: palette.accent }]} />
            <Text style={[styles.brand, { color: palette.textDim }]}>Portfolio</Text>
          </View>
          <Pressable
            onPress={onToggle}
            hitSlop={12}
            style={({ pressed }) => [
              styles.themeBtn,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons
              name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={17}
              color={palette.accent}
            />
          </Pressable>
        </View>

        {/* hero */}
        <Animated.View style={[styles.hero, heroStyle]}>
          <Reveal delay={60} duration={cinematic.durationSlow}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatarRing, { borderColor: palette.accent + '55' }]} />
              <Image
                source={{ uri: PROFILE.avatarFallback }}
                style={styles.avatar}
                contentFit="cover"
                transition={700}
                placeholder={{ blurhash: 'L6Pj0^i_.AyE_3t7t7R**0o#DgR4' }}
              />
              <View
                style={[styles.statusDot, { backgroundColor: palette.sage, borderColor: palette.bg }]}
              />
            </View>
          </Reveal>

          <Reveal delay={160}>
            <Text style={[styles.heroName, { color: palette.text }]}>{PROFILE.name}</Text>
          </Reveal>
          <Reveal delay={220}>
            <Text style={[styles.heroRole, { color: palette.accent }]}>
              {PROFILE.title}
            </Text>
          </Reveal>
          <TitleWipe color={palette.accent} />
          <Reveal delay={300}>
            <View style={styles.pillRow}>
              <Pill icon="location">{PROFILE.location}</Pill>
              <Pill icon="business" color={palette.sage}>
                {PROFILE.company}
              </Pill>
            </View>
          </Reveal>
          <Reveal delay={360}>
            <Text style={[styles.heroBio, { color: palette.textDim }]}>{PROFILE.bio}</Text>
          </Reveal>

          <Reveal delay={430} style={styles.ctaRow}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                navigation.navigate('WorkTab');
              }}
              style={({ pressed }) => [
                styles.ctaPrimary,
                { backgroundColor: palette.accent, opacity: pressed ? 0.9 : 1 },
                shadowFor(palette),
              ]}
            >
              <Ionicons name="play" size={15} color={palette.onAccent} />
              <Text style={[styles.ctaPrimaryText, { color: palette.onAccent }]}>
                View the work
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                navigation.navigate('ProfileTab');
              }}
              style={({ pressed }) => [
                styles.ctaGhost,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="person-outline" size={15} color={palette.text} />
              <Text style={[styles.ctaGhostText, { color: palette.text }]}>About me</Text>
            </Pressable>
          </Reveal>
        </Animated.View>

        {/* stats */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <StatBlock key={s.label} {...s} index={i} />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader
            eyebrow="Selected"
            title="Senior-level builds"
            action="All"
            onAction={() => navigation.navigate('WorkTab')}
          />
          <Reveal delay={120}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: spacing.xl, gap: spacing.md }}
              decelerationRate="fast"
              snapToInterval={232}
            >
              {featured.map((r, i) => {
                const tint = accentOf(r.accentKey, palette);
                return (
                  <Reveal key={r.id} delay={160 + i * 80} style={{ width: 216 }}>
                    <Pressable
                      onPress={() => navigation.navigate('ProjectDetail', { id: r.id })}
                      style={({ pressed }) => [
                        styles.featCard,
                        {
                          backgroundColor: palette.surface,
                          borderColor: palette.border,
                          transform: [{ scale: pressed ? 0.975 : 1 }],
                        },
                        shadowFor(palette),
                      ]}
                    >
                      <LinearGradient
                        colors={[tint + '38', 'transparent']}
                        style={styles.featGlow}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                      <View style={[styles.featBar, { backgroundColor: tint }]} />
                      <Text style={[styles.featName, { color: palette.text }]} numberOfLines={2}>
                        {r.displayName}
                      </Text>
                      <Text style={[styles.featBlurb, { color: palette.textDim }]} numberOfLines={3}>
                        {r.blurb}
                      </Text>
                      <View style={styles.featMeta}>
                        <MaterialIcons name={langIcon(r.language)} size={14} color={tint} />
                        <Text style={[styles.featLang, { color: palette.textFaint }]}>
                          {r.language}
                        </Text>
                        <View style={{ flex: 1 }} />
                        <Ionicons name="star" size={11} color={palette.accent} />
                        <Text style={[styles.featStars, { color: palette.textFaint }]}>
                          {r.stars}
                        </Text>
                      </View>
                    </Pressable>
                  </Reveal>
                );
              })}
            </ScrollView>
          </Reveal>
        </View>

        {/* highlights */}
        <View style={styles.section}>
          <SectionHeader eyebrow="Elsewhere" title="Also on the shelf" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing.xl, gap: spacing.md }}
            decelerationRate="fast"
            snapToInterval={232}
          >
            {HIGHLIGHTS.map((h, i) => (
              <HighlightRow key={h.label} item={h} index={i} />
            ))}
          </ScrollView>
        </View>

        {/* github summary */}
        <View style={styles.section}>
          <Reveal delay={100}>
            <Card tone="alt" style={styles.ghCard}>
              <LinearGradient
                colors={isDark ? ['#1E1913', 'transparent'] : ['#FFF6E8', 'transparent']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.ghTop}>
                <Ionicons name="logo-github" size={22} color={palette.text} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ghTitle, { color: palette.text }]}>
                    {totalStars} stars across this portfolio
                  </Text>
                  <Text style={[styles.ghSub, { color: palette.textDim }]}>
                    {REPOS.length} featured apps · 679 public repositories overall
                  </Text>
                </View>
              </View>
              <View style={styles.ghChips}>
                <Pill icon="code-slash" color={palette.sky}>Kotlin · Compose</Pill>
                <Pill icon="logo-javascript" color={palette.accent}>JavaScript · TS</Pill>
                <Pill icon="shield-checkmark" color={palette.sage}>Cybersecurity</Pill>
                <Pill icon="sparkles" color={palette.rose}>AI · ML</Pill>
              </View>
            </Card>
          </Reveal>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

export const langIcon = (lang: string) => {
  switch (lang) {
    case 'PHP':
      return 'language';
    case 'CSS':
      return 'color-lens';
    case 'TypeScript':
      return 'code';
    case 'JavaScript':
      return 'javascript';
    default:
      return 'widgets';
  }
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  lightWrap: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  blob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 999,
    opacity: 0.3,
    top: -90,
    left: -60,
  },
  blobB: { top: 60, left: undefined, right: -120, width: 260, height: 260 },
  blobC: { top: 320, left: '20%', width: 240, height: 240, opacity: 0.16 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: { width: 7, height: 7, borderRadius: 999 },
  brand: { fontSize: 12, letterSpacing: 2.4, textTransform: 'uppercase', fontWeight: '700' },
  themeBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  hero: { alignItems: 'center', paddingHorizontal: spacing.xl },
  avatarWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  avatarRing: {
    position: 'absolute',
    width: 118,
    height: 118,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  avatar: { width: 100, height: 100, borderRadius: 999, backgroundColor: '#2A241C' },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 999,
    borderWidth: 3,
  },
  heroName: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1.1,
    textAlign: 'center',
  },
  heroRole: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 6,
    textAlign: 'center',
  },
  wipe: { height: 2, borderRadius: 2, marginTop: 14, maxWidth: 120 },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroBio: {
    fontSize: 14.5,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 340,
  },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 26, flexWrap: 'wrap', justifyContent: 'center' },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: radius.pill,
  },
  ctaPrimaryText: { fontSize: 14.5, fontWeight: '700' },
  ctaGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  ctaGhostText: { fontSize: 14.5, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.xxl + 8,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(128,110,90,0.09)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,110,90,0.14)',
  },
  statCol: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  statValue: { fontSize: 27, fontWeight: '700', letterSpacing: -1 },
  statLabel: { fontSize: 11.5, fontWeight: '600', marginTop: 3 },
  statNote: { fontSize: 9.5, marginTop: 2, textAlign: 'center' },
  section: { marginTop: spacing.xxxl, paddingLeft: spacing.xl },
  featCard: {
    width: 216,
    height: 172,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  featGlow: { ...StyleSheet.absoluteFill, opacity: 0.7 },
  featBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  featName: { fontSize: 15.5, fontWeight: '700', letterSpacing: -0.3, marginTop: 2 },
  featBlurb: { fontSize: 12.5, lineHeight: 18, marginTop: 6 },
  featMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 'auto' },
  featLang: { fontSize: 11, fontWeight: '600' },
  featStars: { fontSize: 11, fontWeight: '700' },
  hlCard: { padding: spacing.lg, height: 158 },
  hlTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hlIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hlLabel: { fontSize: 14.5, fontWeight: '700', marginTop: 12 },
  hlValue: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  hlNote: { fontSize: 11.5, lineHeight: 16, marginTop: 6 },
  ghCard: {
    marginRight: spacing.xl,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  ghTop: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  ghTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.4 },
  ghSub: { fontSize: 12.5, marginTop: 4, lineHeight: 18 },
  ghChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: spacing.lg },
});
