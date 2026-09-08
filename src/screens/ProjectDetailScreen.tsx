import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { useTheme } from '../context/ThemeContext';
import { REPOS, accentOf } from '../data/profile';
import { spacing, radius, shadowFor, cinematic } from '../theme';
import { Reveal, CALM } from '../components/Motion';
import { Card, Pill, Badge, SectionHeader } from '../components/UI';
import { langIcon } from './HomeScreen';

function Stat({ label, value, icon, tint }: any) {
  const { palette } = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: palette.surfaceAlt, borderColor: palette.borderSoft }]}>
      <Ionicons name={icon} size={15} color={tint} />
      <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: palette.textFaint }]}>{label}</Text>
    </View>
  );
}

export default function ProjectDetailScreen({ route, navigation }: any) {
  const { palette, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const repo = useMemo(() => REPOS.find((r) => r.id === route.params?.id) ?? REPOS[0], [route]);
  const tint = accentOf(repo.accentKey, palette);

  const hero = useSharedValue(0);
  useEffect(() => {
    hero.value = withDelay(60, withTiming(1, { duration: cinematic.durationSlow, easing: CALM }));
  }, [hero]);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: hero.value,
    transform: [
      { translateY: interpolate(hero.value, [0, 1], [26, 0], Extrapolation.CLAMP) },
      { scale: interpolate(hero.value, [0, 1], [1.05, 1], Extrapolation.CLAMP) },
    ],
  }));

  const related = REPOS.filter((r) => r.category === repo.category && r.id !== repo.id).slice(0, 4);

  const open = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    try {
      await Linking.openURL(repo.url);
    } catch {}
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 44 }}
      >
        <Animated.View style={[styles.hero, heroStyle]}>
          <LinearGradient
            colors={[tint + (isDark ? '40' : '30'), palette.bg]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.9, y: 1 }}
          />
          <View style={[styles.heroIcon, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <MaterialIcons name={langIcon(repo.language)} size={30} color={tint} />
          </View>
          <Text style={[styles.heroName, { color: palette.text }]}>{repo.displayName}</Text>
          <Text style={[styles.heroSlug, { color: palette.textFaint }]}>moekyawaung-tech/{repo.name}</Text>
          <View style={styles.heroTags}>
            {repo.tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </View>
        </Animated.View>

        <View style={styles.statsRow}>
          <Reveal delay={140} style={styles.statWrap}>
            <Stat label="Stars" value={repo.stars} icon="star" tint={palette.accent} />
          </Reveal>
          <Reveal delay={190} style={styles.statWrap}>
            <Stat label="Forks" value={repo.forks} icon="git-branch" tint={palette.sky} />
          </Reveal>
          <Reveal delay={240} style={styles.statWrap}>
            <Stat label="Stack" value={repo.language} icon="code-slash" tint={tint} />
          </Reveal>
          <Reveal delay={290} style={styles.statWrap}>
            <Stat label="Shipped" value={repo.created.slice(0, 7)} icon="calendar" tint={palette.sage} />
          </Reveal>
        </View>

        <View style={styles.body}>
          <Reveal delay={160}>
            <SectionHeader eyebrow="What it is" title="The idea" />
            <Text style={[styles.para, { color: palette.textDim }]}>{repo.description}</Text>
          </Reveal>

          <Reveal delay={230}>
            <View style={styles.divider} />
            <SectionHeader eyebrow="Under the hood" title="What's inside" />
            <View style={styles.featureList}>
              {repo.features.map((f, i) => (
                <Reveal key={f} delay={260 + i * 70}>
                  <View style={styles.feature}>
                    <View style={[styles.featureDot, { backgroundColor: tint }]} />
                    <Text style={[styles.featureText, { color: palette.text }]}>{f}</Text>
                  </View>
                </Reveal>
              ))}
            </View>
          </Reveal>

          <Reveal delay={300}>
            <View style={styles.divider} />
            <SectionHeader eyebrow="Details" title="At a glance" />
            <Card tone="alt" style={styles.metaCard}>
              {[
                ['Repository', `moekyawaung-tech/${repo.name}`],
                ['Primary language', repo.language],
                ['Category', repo.category],
                ['Created', repo.created],
                ['Licence', 'Open source'],
              ].map(([k, v], i, arr) => (
                <View
                  key={k}
                  style={[
                    styles.metaRow,
                    i < arr.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: palette.borderSoft,
                    },
                  ]}
                >
                  <Text style={[styles.metaKey, { color: palette.textFaint }]}>{k}</Text>
                  <Text style={[styles.metaVal, { color: palette.text }]}>{v}</Text>
                </View>
              ))}
            </Card>
          </Reveal>

          <Reveal delay={340}>
            <Pressable
              onPress={open}
              style={({ pressed }) => [
                styles.cta,
                { backgroundColor: tint, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
                shadowFor(palette),
              ]}
            >
              <Ionicons name="logo-github" size={17} color={palette.onAccent} />
              <Text style={[styles.ctaText, { color: palette.onAccent }]}>Open on GitHub</Text>
              <Ionicons name="open-outline" size={15} color={palette.onAccent} />
            </Pressable>
          </Reveal>

          {related.length > 0 && (
            <Reveal delay={380}>
              <View style={styles.divider} />
              <SectionHeader eyebrow="More like this" title="Related apps" />
              {related.map((r, i) => {
                const rt = accentOf(r.accentKey, palette);
                return (
                  <Reveal key={r.id} delay={400 + i * 60}>
                    <Pressable
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        navigation.push('ProjectDetail', { id: r.id });
                      }}
                      style={({ pressed }) => [
                        styles.related,
                        {
                          backgroundColor: palette.surface,
                          borderColor: palette.border,
                          opacity: pressed ? 0.82 : 1,
                        },
                      ]}
                    >
                      <View style={[styles.relatedBar, { backgroundColor: rt }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.relatedName, { color: palette.text }]}>{r.displayName}</Text>
                        <Text style={[styles.relatedBlurb, { color: palette.textFaint }]} numberOfLines={1}>
                          {r.blurb}
                        </Text>
                      </View>
                      <Badge label={r.language} color={rt} />
                      <Ionicons name="chevron-forward" size={16} color={palette.textFaint} />
                    </Pressable>
                  </Reveal>
                );
              })}
            </Reveal>
          )}
        </View>
      </ScrollView>

      <View style={[styles.navBar, { top: insets.top + 4 }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={({ pressed }) => [
            styles.navBtn,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="chevron-back" size={19} color={palette.text} />
        </Pressable>
        <Pressable
          onPress={open}
          hitSlop={12}
          style={({ pressed }) => [
            styles.navBtn,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="share-outline" size={18} color={palette.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    alignItems: 'center',
    paddingTop: 96,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.lg,
  },
  heroName: { fontSize: 27, fontWeight: '700', letterSpacing: -0.8, textAlign: 'center' },
  heroSlug: { fontSize: 12.5, marginTop: 7, fontFamily: 'monospace' },
  heroTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: spacing.lg, justifyContent: 'center' },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg - 4,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statWrap: { flexGrow: 1, flexBasis: '22%' },
  stat: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: 6,
    minWidth: 76,
  },
  statValue: { fontSize: 15, fontWeight: '700', marginTop: 6 },
  statLabel: { fontSize: 9.5, marginTop: 2, letterSpacing: 0.4 },
  body: { paddingHorizontal: spacing.xl, marginTop: spacing.xxl },
  para: { fontSize: 14.5, lineHeight: 23 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(128,110,90,0.18)', marginVertical: spacing.xxl },
  featureList: { gap: 2 },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 9 },
  featureDot: { width: 6, height: 6, borderRadius: 999, marginTop: 7 },
  featureText: { flex: 1, fontSize: 14, lineHeight: 21 },
  metaCard: { padding: spacing.lg },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 16,
  },
  metaKey: { fontSize: 12.5, flexShrink: 0 },
  metaVal: { fontSize: 12.5, fontWeight: '600', textAlign: 'right', flex: 1 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: radius.pill,
    marginTop: spacing.xxl,
  },
  ctaText: { fontSize: 15, fontWeight: '700' },
  related: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  relatedBar: { width: 3, height: 34, borderRadius: 3 },
  relatedName: { fontSize: 14, fontWeight: '700' },
  relatedBlurb: { fontSize: 11.5, marginTop: 2 },
  navBar: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
