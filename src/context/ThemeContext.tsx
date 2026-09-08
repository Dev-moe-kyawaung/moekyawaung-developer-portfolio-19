import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { darkPalette, lightPalette, Palette } from '../theme';

const STORAGE_KEY = '@moekyawaung.theme.v1';

type Mode = 'light' | 'dark';

type ThemeValue = {
  palette: Palette;
  mode: Mode;
  isDark: boolean;
  toggle: () => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeValue>({
  palette: darkPalette,
  mode: 'dark',
  isDark: true,
  toggle: () => {},
  ready: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<Mode>(system === 'light' ? 'light' : 'dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (alive && (stored === 'light' || stored === 'dark')) setMode(stored);
      } catch {
        // fall back to system preference silently
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback(async (next: Mode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      // non-fatal
    }
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next: Mode = prev === 'dark' ? 'light' : 'dark';
      persist(next);
      return next;
    });
  }, [persist]);

  const value = useMemo<ThemeValue>(
    () => ({
      palette: mode === 'dark' ? darkPalette : lightPalette,
      mode,
      isDark: mode === 'dark',
      toggle,
      ready,
    }),
    [mode, toggle, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
