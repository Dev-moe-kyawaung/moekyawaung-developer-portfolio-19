import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';
import { PROFILE, LINKS, accentOf, REPOS, STATS } from '../data/profile';
import { spacing, radius, shadowFor } from '../theme';
import { Reveal } from '../components/Motion';
import { Card, SectionHeader, Pill, Badge } from '../components/UI';
import { downloadResume, DownloadResult } from '../lib/resume';

export default function ProfileScreen() {
  const { palette, isDark, mode, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);

  const open = async (url: string) => {
    Haptics.selectionAsync().catch(() => {});
    try {
      await Linking.openURL(url);
    } catch {}
  };

  const onDownload = async () => {
    if (busy) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setBusy(true);
    setResult(null);
    const r = await downloadResume();
    setResult(r);
    setBusy(false);
    Haptics.notificationAsync(
      r.ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    ).catch(() => {});
  };

  const totalStars = REPOS.reduce((n, r) => n + r.stars, 0);

  return (
    <View style={[styles.root, { backgroundColor: palette.bg, paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* header plate */}
        <View style={styles.plate}>
          <LinearGradient
            colors={
              isDark
                ? ['#2A2018', '#14110D', palette.bg]
                : ['#F6E3CD', '#FAF2E6', palette.bg]
            }
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.plateTop}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                toggle();
              }}
              hitSlop={12}
              style={({ pressed }) => [
                styles.iconBtn,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
                size={17}
                color={palette.accent}
              />
            </Pressable>
            <Pressable
              onPress={() => open(PROFILE.gravatarUrl)}
              hitSlop={12}
              style={({ pressed }) => [
                styles.iconBtn,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="person-circle-outline" size={18} color={palette.text} />
            </Pressable>
          </View>

          <Reveal delay={60}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: PROFILE.avatar }}
                style={styles.avatar}
                contentFit="cover"
                transition={700}
                onError={(e) => {}}
                placeholder={{ blurhash: 'L6Pj0^i_.AyE_3t7t7R**0o#DgR4' }}
              />
              {PROFILE.hireable && (
                <View style={[styles.hireable, { backgroundColor: palette.sage, borderColor: palette.bg }]}>
                  <Ionicons name="briefcase" size={10} color="#0B1A11" />
                </View>
              )}
            </View>
            <Text style={[styles.name, { color: palette.text }]}>{PROFILE.name}</Text>
            <Text style={[styles.role, { color: palette.accent }]}>{PROFILE.title}</Text>
            <View style={styles.metaRow}>
              <Pill icon="location">{PROFILE.location}</Pill>
              <Pill icon="business" color={palette.sage}>
                {PROFILE.companyGravatar}
              </Pill>
            </View>
          </Reveal>
        </View>

        <View style={styles.body}>
          {/* resume CTA */}
          <Reveal delay={120}>
            <Pressable
              onPress={onDownload}
              disabled={busy}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              style={{
                transform: [{ scale: pressed ? 0.985 : 1 }],
              }}
            >
              <View
                style={[
                  styles.resumeInner,
                  {
                    backgroundColor: pressed ? palette.accent : palette.surface,
                    borderColor: pressed ? palette.accent : palette.border,
                    opacity: busy ? 0.72 : 1,
                  },
                  shadowFor(palette),
                ]}
              >
              <View
                style={[
                  styles.resumeIcon,
                  { backgroundColor: pressed ? 'rgba(255,255,255,0.2)' : palette.accentSoft },
                ]}
              >
                {busy ? (
                  <ActivityIndicator size="small" color={palette.accent} />
                ) : (
                  <Ionicons name="download-outline" size={19} color={palette.accent} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.resumeTitle,
                    { color: pressed ? palette.onAccent : palette.text },
                  ]}
                >
                  {busy ? 'Preparing…' : 'Download resume'}
                </Text>
                <Text
                  style={[
                    styles.resumeSub,
                    { color: pressed ? palette.onAccent : palette.textDim },
                  ]}
                >
                  HTML · includes all {REPOS.length} builds · print-ready
                </Text>
              </View>
              {!busy && (
                <Ionicons
                  name="arrow-down-circle"
                  size={24}
                  color={pressed ? palette.onAccent : palette.accent}
                />
              )}
              </View>
            </Pressable>
            {!!result && (
              <Reveal delay={20}>
                <View
                  style={[
                    styles.result,
                    {
                      backgroundColor: result.ok ? palette.sage + '1A' : palette.rose + '1A',
                      borderColor: (result.ok ? palette.sage : palette.rose) + '44',
                    },
                  ]}
                >
                  <Ionicons
                    name={result.ok ? 'checkmark-circle' : 'alert-circle'}
                    size={15}
                    color={result.ok ? palette.sage : palette.rose}
                  />
                  <Text style={[styles.resultText, { color: palette.text }]}>{result.message}</Text>
                </View>
              </Reveal>
            )}
          </Reveal>

          {/* stats */}
          <Reveal delay={180}>
            <View style={styles.statRow}>
              {[
                { label: 'Repos', value: '679', icon: 'albums' },
                { label: 'Stars here', value: String(totalStars), icon: 'star' },
                { label: 'Followers', value: '61', icon: 'people' },
                { label: 'Years', value: '12+', icon: 'time' },
              ].map((s, i) => {
                const tints = [palette.accent, palette.sky, palette.sage, palette.rose];
                return (
                  <Reveal key={s.label} delay={200 + i * 60} style={{ flex: 1 }}>
                    <View style={[styles.stat, { backgroundColor: palette.surfaceAlt, borderColor: palette.borderSoft }]}>
                      <Ionicons name={s.icon as any} size={14} color={tints[i]} />
                      <Text style={[styles.statValue, { color: palette.text }]}>{s.value}</Text>
                      <Text style={[styles.statLabel, { color: palette.textFaint }]}>{s.label}</Text>
                    </View>
                  </Reveal>
                );
              })}
            </View>
          </Reveal>

          {/* about */}
          <Reveal delay={240}>
            <View style={{ height: spacing.xxl }} />
            <SectionHeader eyebrow="Gravatar" title="About" />
            <Card tone="alt" style={styles.aboutCard}>
              <Text style={[styles.about, { color: palette.textDim }]}>{PROFILE.gravatarBio}</Text>
              <View style={styles.aboutMeta}>
                <Badge label="Android Developer" color={palette.accent} />
                <Badge label={PROFILE.pronouns} color={palette.sky} />
                <Badge label="Verified Gravatar" color={palette.sage} />
              </View>
            </Card>
          </Reveal>

          {/* github bio */}
          <Reveal delay={280}>
            <View style={{ height: spacing.xxl }} />
            <SectionHeader eyebrow="GitHub" title="Profile bio" />
            <Card style={styles.ghCard}>
              <View style={styles.ghTop}>
                <Ionicons name="logo-github" size={20} color={palette.text} />
                <Text style={[styles.ghHandle, { color: palette.text }]}>{PROFILE.handle}</Text>
                <View style={{ flex: 1 }} />
                <Pill icon="git-commit">id 277224745</Pill>
              </View>
              <Text style={[styles.ghBio, { color: palette.textDim }]}>
                {PROFILE.githubBio}
              </Text>
              <View style={styles.tagWrap}>
                {['Kotlin', 'Jetpack Compose', 'AI/ML', 'Cybersecurity', 'Open source'].map((t) => (
                  <View key={t} style={[styles.tag, { backgroundColor: palette.surfaceAlt }]}>
                    <Text style={[styles.tagText, { color: palette.textDim }]}>{t}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </Reveal>

          {/* contact */}
          <Reveal delay={320}>
            <View style={{ height: spacing.xxl }} />
            <SectionHeader eyebrow="Say hello" title="Find me" />
            <View style={styles.linkList}>
              {LINKS.map((l, i) => {
                const tint = accentOf(l.accentKey, palette);
                return (
                  <Reveal key={l.label + l.url} delay={340 + i * 55}>
                    <Pressable
                      onPress={() => open(l.url)}
                      style={({ pressed }) => [
                        styles.link,
                        {
                          backgroundColor: palette.surface,
                          borderColor: pressed ? tint + '66' : palette.border,
                          opacity: pressed ? 0.85 : 1,
                          transform: [{ scale: pressed ? 0.99 : 1 }],
                        },
                      ]}
                    >
                      <View style={[styles.linkIcon, { backgroundColor: tint + '1E' }]}>
                        <Ionicons name={l.icon as any} size={17} color={tint} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.linkLabel, { color: palette.text }]}>{l.label}</Text>
                        <Text style={[styles.linkHandle, { color: palette.textFaint }]} numberOfLines={1}>
                          {l.handle}
                        </Text>
                      </View>
                      <Ionicons name="open-outline" size={15} color={palette.textFaint} />
                    </Pressable>
                  </Reveal>
                );
              })}
            </View>
          </Reveal>

          <Reveal delay={380}>
            <View style={{ height: spacing.xxl }} />
            <Pressable
              onPress={() => open(`mailto:${PROFILE.email}`)}
              style={({ pressed }) => [
                styles.hire,
                { backgroundColor: palette.accent, opacity: pressed ? 0.9 : 1 },
                shadowFor(palette),
              ]}
            >
              <Ionicons name="mail" size={17} color={palette.onAccent} />
              <Text style={[styles.hireText, { color: palette.onAccent }]}>Work with me</Text>
            </Pressable>
            <Text style={[styles.colophon, { color: palette.textFaint }]}>
              Built with React Native · Expo · Reanimated. Motion tuned for calm.
            </Text>
          </Reveal>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  plate: { paddingTop: spacing.lg, paddingBottom: spacing.xxl, alignItems: 'center' },
  plateTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    width: '100%',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarWrap: { alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 108, height: 108, borderRadius: 999, backgroundColor: '#2A241C' },
  hireable: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  name: { fontSize: 28, fontWeight: '700', letterSpacing: -0.9, marginTop: spacing.lg },
  role: { fontSize: 14, fontWeight: '700', marginTop: 5 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  body: { paddingHorizontal: spacing.xl },
  resume: { marginBottom: 0 },
  resumeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  resumeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeTitle: { fontSize: 15.5, fontWeight: '700' },
  resumeSub: { fontSize: 11.5, marginTop: 3 },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.md,
  },
  resultText: { fontSize: 12.5, flex: 1 },
  statRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 3,
  },
  statValue: { fontSize: 16, fontWeight: '800', marginTop: 3 },
  statLabel: { fontSize: 9.5, letterSpacing: 0.3 },
  aboutCard: { padding: spacing.lg },
  about: { fontSize: 13.5, lineHeight: 21.5 },
  aboutMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: spacing.lg },
  ghCard: { padding: spacing.lg },
  ghTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ghHandle: { fontSize: 14.5, fontWeight: '700' },
  ghBio: { fontSize: 13.5, lineHeight: 21, marginTop: spacing.md },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: spacing.md },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  tagText: { fontSize: 11, fontWeight: '600' },
  linkList: { gap: spacing.sm },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  linkIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: { fontSize: 14, fontWeight: '700' },
  linkHandle: { fontSize: 11.5, marginTop: 2 },
  hire: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: radius.pill,
  },
  hireText: { fontSize: 15, fontWeight: '700' },
  colophon: { fontSize: 11, textAlign: 'center', marginTop: spacing.xl, lineHeight: 17 },
});
