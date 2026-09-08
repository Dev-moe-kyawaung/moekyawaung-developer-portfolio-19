import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  RefreshControl,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

import { useTheme } from '../context/ThemeContext';
import { REPOS, CATEGORIES, accentOf, Repo } from '../data/profile';
import { spacing, radius, shadowFor, cinematic } from '../theme';
import { Reveal, CALM } from '../components/Motion';
import { Chip, EmptyState, Badge, SectionHeader } from '../components/UI';
import { langIcon } from './HomeScreen';

const PAD = spacing.xl;

function ProjectCard({
  repo,
  index,
  onPress,
  columns,
}: {
  repo: Repo;
  index: number;
  onPress: () => void;
  columns: number;
}) {
  const { palette, isDark } = useTheme();
  const tint = accentOf(repo.accentKey, palette);
  const [pressed, setPressed] = useState(false);
  const wide = columns === 1;

  return (
    <Animated.View
      entering={FadeIn.duration(cinematic.duration).delay(Math.min(index, 6) * 55)}
      layout={Layout.duration(cinematic.durationFast).easing(CALM)}
      style={{ width: wide ? '100%' : '48.4%' }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: pressed ? tint + '77' : palette.border,
            transform: [{ scale: pressed ? 0.975 : 1 }],
          },
          shadowFor(palette),
        ]}
      >
        <LinearGradient
          colors={[tint + (isDark ? '30' : '26'), 'transparent']}
          style={styles.cardGlow}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 0.9 }}
        />
        <View style={[styles.cardStripe, { backgroundColor: tint }]} />

        <View style={styles.cardHead}>
          <View style={[styles.langIcon, { backgroundColor: tint + '1F' }]}>
            <MaterialIcons name={langIcon(repo.language)} size={15} color={tint} />
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.starRow}>
            <Ionicons name="star" size={11} color={palette.accent} />
            <Text style={[styles.starText, { color: palette.textDim }]}>{repo.stars}</Text>
            <Ionicons name="git-branch" size={11} color={palette.textFaint} style={{ marginLeft: 6 }} />
            <Text style={[styles.starText, { color: palette.textFaint }]}>{repo.forks}</Text>
          </View>
        </View>

        <Text style={[styles.cardName, { color: palette.text }]} numberOfLines={2}>
          {repo.displayName}
        </Text>
        <Text style={[styles.cardBlurb, { color: palette.textDim }]} numberOfLines={wide ? 4 : 3}>
          {repo.blurb}
        </Text>

        <View style={styles.tagRow}>
          {repo.tags.slice(0, wide ? 3 : 2).map((t) => (
            <View key={t} style={[styles.tag, { backgroundColor: palette.surfaceAlt }]}>
              <Text style={[styles.tagText, { color: palette.textFaint }]}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardFoot}>
          <Badge label={repo.language} color={tint} />
          <View style={{ flex: 1 }} />
          <Ionicons name="arrow-forward-circle" size={20} color={tint} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function WorkScreen({ navigation }: any) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState<'stars' | 'new' | 'name'>('stars');
  const [refreshing, setRefreshing] = useState(false);
  const [grid, setGrid] = useState(false);

  const columns = grid && width > 380 ? 2 : 1;

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = REPOS.filter((r) => (cat === 'all' ? true : r.category === cat));
    if (q) {
      list = list.filter((r) =>
        [r.displayName, r.name, r.blurb, r.language, r.description, ...r.tags]
          .join(' ')
          .toLowerCase()
          .includes(q),
      );
    }
    const sorted = [...list];
    if (sort === 'stars') sorted.sort((a, b) => b.stars - a.stars);
    if (sort === 'new') sorted.sort((a, b) => b.created.localeCompare(a.created));
    if (sort === 'name') sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return sorted;
  }, [query, cat, sort]);

  const onRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const pickCat = (key: string) => {
    Haptics.selectionAsync().catch(() => {});
    setCat(key);
  };

  const sortIcon = (s: typeof sort) =>
    sort === s ? 'radio-button-on' : 'radio-button-off';

  const header = (
    <View style={styles.head}>
      <Reveal delay={40}>
        <Text style={[styles.eyebrow, { color: palette.accent }]}>The portfolio</Text>
        <Text style={[styles.title, { color: palette.text }]}>Featured apps</Text>
        <Text style={[styles.subtitle, { color: palette.textDim }]}>
          {REPOS.length} senior-level builds — video, dashboards, games, PWAs, job portals and a
          four-generation POS suite.
        </Text>
      </Reveal>

      <Reveal delay={110}>
        <View
          style={[
            styles.search,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}
        >
          <Ionicons name="search" size={16} color={palette.textFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search apps, stacks, features…"
            placeholderTextColor={palette.textFaint}
            style={[styles.searchInput, { color: palette.text }]}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {!!query && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={16} color={palette.textFaint} />
            </Pressable>
          )}
        </View>
      </Reveal>

      <Reveal delay={160}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          keyboardShouldPersistTaps="handled"
        >
          {CATEGORIES.map((c) => (
            <Chip key={c.key} label={c.label} active={cat === c.key} onPress={() => pickCat(c.key)} />
          ))}
        </ScrollView>
      </Reveal>

      <Reveal delay={210}>
        <View style={styles.toolbar}>
          <View style={styles.sortRow}>
            {(['stars', 'new', 'name'] as const).map((s) => (
              <Pressable
                key={s}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setSort(s);
                }}
                hitSlop={8}
                style={styles.sortItem}
              >
                <Ionicons
                  name={sortIcon(s) as any}
                  size={13}
                  color={sort === s ? palette.accent : palette.textFaint}
                />
                <Text
                  style={[
                    styles.sortText,
                    { color: sort === s ? palette.text : palette.textFaint },
                  ]}
                >
                  {s === 'stars' ? 'Top' : s === 'new' ? 'Newest' : 'A–Z'}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setGrid((g) => !g);
            }}
            style={({ pressed }) => [
              styles.gridBtn,
              {
                backgroundColor: palette.surfaceAlt,
                borderColor: palette.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name={grid ? 'list' : 'grid'}
              size={14}
              color={palette.textDim}
            />
          </Pressable>
        </View>
        <Text style={[styles.count, { color: palette.textFaint }]}>
          {data.length} {data.length === 1 ? 'app' : 'apps'}
        </Text>
      </Reveal>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: palette.bg, paddingTop: insets.top }]}>
      <FlatList
        data={data}
        key={columns}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        ListHeaderComponent={header}
        columnWrapperStyle={columns === 2 ? styles.columnWrap : undefined}
        contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: PAD }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={palette.accent}
            colors={[palette.accent]}
            progressBackgroundColor={palette.surface}
          />
        }
        renderItem={({ item, index }) => (
          <ProjectCard
            repo={item}
            index={index}
            columns={columns}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              navigation.navigate('ProjectDetail', { id: item.id });
            }}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="Nothing matches that"
            body={`No app in the portfolio fits “${query || CATEGORIES.find((c) => c.key === cat)?.label}”. Try another stack or clear the filters.`}
            actionLabel="Reset search"
            onAction={() => {
              setQuery('');
              setCat('all');
            }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  head: { paddingTop: spacing.lg, marginBottom: spacing.sm },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -1, marginTop: 6 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 10 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.xl,
  },
  searchInput: { flex: 1, fontSize: 14.5, padding: 0 },
  chips: { gap: 8, paddingVertical: spacing.lg, paddingRight: spacing.xl },
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sortRow: { flexDirection: 'row', gap: 14 },
  sortItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sortText: { fontSize: 12.5, fontWeight: '600' },
  gridBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  count: { fontSize: 11.5, marginTop: 10, letterSpacing: 0.3 },
  columnWrap: { justifyContent: 'space-between', gap: spacing.md },
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    marginTop: spacing.lg,
    overflow: 'hidden',
    minHeight: 190,
  },
  cardGlow: { ...StyleSheet.absoluteFill },
  cardStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  cardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  langIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  starText: { fontSize: 11, fontWeight: '700' },
  cardName: { fontSize: 16.5, fontWeight: '700', letterSpacing: -0.4 },
  cardBlurb: { fontSize: 12.5, lineHeight: 18, marginTop: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontSize: 10, fontWeight: '600' },
  cardFoot: { flexDirection: 'row', alignItems: 'center', marginTop: 'auto', paddingTop: 14 },
});
