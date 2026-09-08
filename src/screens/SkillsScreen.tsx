import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

import { useTheme } from '../context/ThemeContext';
import { SKILLS, accentOf, TIMELINE } from '../data/profile';
import { spacing, radius, cinematic } from '../theme';
import { Reveal, CALM } from '../components/Motion';
import { Card, SectionHeader, Meter, Chip, Badge } from '../components/UI';

const STACK = [
  { icon: 'logo-android', label: 'Android native', note: 'Kotlin · Compose · Media3', key: 'amber' as const },
  { icon: 'phone-portrait', label: 'Cross-platform', note: 'React Native · Expo', key: 'sky' as const },
  { icon: 'globe', label: 'Web & PWA', note: 'React · TS · Service workers', key: 'sage' as const },
  { icon: 'server', label: 'Back-end', note: 'PHP · Node · MySQL', key: 'rose' as const },
  { icon: 'sparkles', label: 'AI & vision', note: 'Python · Gemini · OpenCV', key: 'amber' as const },
  { icon: 'shield-checkmark', label: 'Security', note: 'Cyber · Ethical hacking', key: 'sage' as const },
];

function GroupCard({
  group,
  index,
}: {
  group: (typeof SKILLS)[number];
  index: number;
}) {
  const { palette, isDark } = useTheme();
  const [open, setOpen] = useState(true);
  const tint = accentOf(group.accentKey, palette);

  return (
    <Reveal delay={120 + index * 90}>
      <Card style={styles.group} tone="surface">
        <LinearGradient
          colors={[tint + (isDark ? '22' : '1A'), 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.6 }}
        />
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setOpen((o) => !o);
          }}
          style={styles.groupHead}
        >
          <View style={[styles.groupDot, { backgroundColor: tint }]} />
          <Text style={[styles.groupTitle, { color: palette.text }]}>{group.title}</Text>
          <View style={{ flex: 1 }} />
          <Text style={[styles.groupCount, { color: palette.textFaint }]}>
            {group.items.length}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={15}
            color={palette.textFaint}
          />
        </Pressable>

        {open && (
          <View style={styles.skills}>
            {group.items.map((item, i) => (
              <Animated.View
                key={item.name}
                entering={FadeIn.duration(cinematic.duration).delay(i * 50)}
                layout={Layout.duration(cinematic.durationFast)}
                style={styles.skill}
              >
                <View style={styles.skillTop}>
                  <Text style={[styles.skillName, { color: palette.text }]}>{item.name}</Text>
                  <Text style={[styles.skillPct, { color: tint }]}>{item.level}%</Text>
                </View>
                <Meter value={item.level} color={tint} delay={i * 60} />
              </Animated.View>
            ))}
          </View>
        )}
      </Card>
    </Reveal>
  );
}

export default function SkillsScreen() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: palette.bg, paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: spacing.xl }}
      >
        <Reveal delay={40}>
          <Text style={[styles.eyebrow, { color: palette.accent }]}>Capabilities</Text>
          <Text style={[styles.title, { color: palette.text }]}>The toolkit</Text>
          <Text style={[styles.subtitle, { color: palette.textDim }]}>
            Twelve years across the Android ecosystem, with the full-stack reach to ship the
            server, the app and the store around them.
          </Text>
        </Reveal>

        <View style={styles.stackGrid}>
          {STACK.map((s, i) => {
            const tint = accentOf(s.key, palette);
            return (
              <Reveal key={s.label} delay={100 + i * 65} style={styles.stackWrap}>
                <Card tone="alt" style={styles.stackCard}>
                  <View style={[styles.stackIcon, { backgroundColor: tint + '20' }]}>
                    <Ionicons name={s.icon as any} size={17} color={tint} />
                  </View>
                  <Text style={[styles.stackLabel, { color: palette.text }]}>{s.label}</Text>
                  <Text style={[styles.stackNote, { color: palette.textFaint }]} numberOfLines={2}>
                    {s.note}
                  </Text>
                </Card>
              </Reveal>
            );
          })}
        </View>

        <View style={{ height: spacing.xxxl }} />
        <SectionHeader eyebrow="Depth" title="Skill levels" />
        {SKILLS.map((g, i) => (
          <View key={g.title} style={{ marginBottom: spacing.md }}>
            <GroupCard group={g} index={i} />
          </View>
        ))}

        <View style={{ height: spacing.lg }} />
        <SectionHeader eyebrow="Track record" title="How it went" />
        {TIMELINE.map((t, i) => (
          <Reveal key={t.title} delay={120 + i * 80}>
            <View style={styles.timeline}>
              <View style={styles.rail}>
                <View style={[styles.node, { backgroundColor: palette.accent }]} />
                {i < TIMELINE.length - 1 && (
                  <View style={[styles.line, { backgroundColor: palette.border }]} />
                )}
              </View>
              <View style={{ flex: 1, paddingBottom: spacing.xl }}>
                <View style={styles.tlTop}>
                  <Text style={[styles.tlTitle, { color: palette.text }]}>{t.title}</Text>
                  <Badge label={t.year} color={palette.accent} />
                </View>
                <Text style={[styles.tlPlace, { color: palette.accent }]}>{t.place}</Text>
                <Text style={[styles.tlBody, { color: palette.textDim }]}>{t.body}</Text>
              </View>
            </View>
          </Reveal>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginTop: spacing.lg,
  },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -1, marginTop: 6 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 10 },
  stackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    rowGap: spacing.md,
  },
  stackWrap: { width: '48.4%' },
  stackCard: { padding: spacing.lg, minHeight: 116 },
  stackIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stackLabel: { fontSize: 14, fontWeight: '700' },
  stackNote: { fontSize: 11.5, marginTop: 4, lineHeight: 16 },
  group: { padding: spacing.lg, overflow: 'hidden' },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  groupDot: { width: 8, height: 8, borderRadius: 999 },
  groupTitle: { fontSize: 15.5, fontWeight: '700', letterSpacing: -0.3 },
  groupCount: { fontSize: 11.5, fontWeight: '700', marginRight: 6 },
  skills: { marginTop: spacing.lg, gap: spacing.md },
  skill: { gap: 6 },
  skillTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  skillName: { fontSize: 13, fontWeight: '600' },
  skillPct: { fontSize: 11.5, fontWeight: '800' },
  timeline: { flexDirection: 'row', gap: spacing.lg },
  rail: { alignItems: 'center', width: 12 },
  node: { width: 9, height: 9, borderRadius: 999, marginTop: 6 },
  line: { width: StyleSheet.hairlineWidth, flex: 1, marginTop: 4 },
  tlTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  tlTitle: { fontSize: 15, fontWeight: '700', flex: 1, letterSpacing: -0.3 },
  tlPlace: { fontSize: 12, fontWeight: '700', marginTop: 3 },
  tlBody: { fontSize: 13, lineHeight: 20, marginTop: 7 },
});
