export type Palette = {
  mode: 'light' | 'dark';
  bg: string;
  bgDeep: string;
  surface: string;
  surfaceAlt: string;
  surfaceHigh: string;
  border: string;
  borderSoft: string;
  text: string;
  textDim: string;
  textFaint: string;
  accent: string;
  accentSoft: string;
  accentAlt: string;
  sage: string;
  sky: string;
  rose: string;
  onAccent: string;
  gradient: [string, string, string];
  glow: string;
  shadow: string;
  tabBar: string;
};

export const darkPalette: Palette = {
  mode: 'dark',
  bg: '#0A0908',
  bgDeep: '#060505',
  surface: '#15130F',
  surfaceAlt: '#1C1914',
  surfaceHigh: '#241F19',
  border: 'rgba(255,240,220,0.10)',
  borderSoft: 'rgba(255,240,220,0.05)',
  text: '#F6F1E8',
  textDim: '#A79C8B',
  textFaint: '#6E6558',
  accent: '#E3A857',
  accentSoft: 'rgba(227,168,87,0.14)',
  accentAlt: '#B9836A',
  sage: '#88AE97',
  sky: '#7FA6C9',
  rose: '#CE8B7E',
  onAccent: '#1A1206',
  gradient: ['#161210', '#0A0908', '#0A0908'],
  glow: 'rgba(227,168,87,0.30)',
  shadow: '#000000',
  tabBar: 'rgba(10,9,8,0.86)',
};

export const lightPalette: Palette = {
  mode: 'light',
  bg: '#F7F2EA',
  bgDeep: '#EFE7DA',
  surface: '#FFFDF9',
  surfaceAlt: '#F1EADD',
  surfaceHigh: '#FFFFFF',
  border: 'rgba(60,42,24,0.12)',
  borderSoft: 'rgba(60,42,24,0.06)',
  text: '#1B1610',
  textDim: '#6B6152',
  textFaint: '#9A8F7E',
  accent: '#B9722F',
  accentSoft: 'rgba(185,114,47,0.12)',
  accentAlt: '#9D7967',
  sage: '#5F8670',
  sky: '#4E7599',
  rose: '#B5685A',
  onAccent: '#FFF7EC',
  gradient: ['#FBF7F0', '#F7F2EA', '#F3ECE0'],
  glow: 'rgba(185,114,47,0.22)',
  shadow: '#7A6A55',
  tabBar: 'rgba(255,253,249,0.9)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
};

/**
 * Cinematic easing curves. Calm motion = long durations, gentle in/out.
 */
export const cinematic = {
  durationSlow: 900,
  duration: 620,
  durationFast: 340,
  stagger: 90,
};

export const shadowFor = (p: Palette) => ({
  shadowColor: p.shadow,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: p.mode === 'dark' ? 0.5 : 0.11,
  shadowRadius: 22,
  elevation: 5,
});
