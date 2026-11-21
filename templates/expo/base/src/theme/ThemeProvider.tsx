import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '../store/storage';
import { ThemeColors, type AppColors } from './colors';

type ColorScheme = 'light' | 'dark';

const THEME_KEY = 'mask.theme';

interface ThemeContextValue {
  colors: AppColors;
  scheme: ColorScheme;
  isDark: boolean;
  setScheme: (scheme: ColorScheme) => void;
  toggleScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<ColorScheme | null>(null);

  useEffect(() => {
    let mounted = true;
    void storage.get(THEME_KEY).then((saved) => {
      if (mounted && (saved === 'light' || saved === 'dark')) {
        setOverride(saved);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const scheme: ColorScheme =
    override ?? (systemScheme === 'light' ? 'light' : 'dark');
  const colors = ThemeColors[scheme];

  const setScheme = useCallback((next: ColorScheme) => {
    setOverride(next);
    void storage.set(THEME_KEY, next);
  }, []);

  const toggleScheme = useCallback(
    () => setScheme(scheme === 'dark' ? 'light' : 'dark'),
    [scheme, setScheme]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors,
      scheme,
      isDark: scheme === 'dark',
      setScheme,
      toggleScheme,
    }),
    [colors, scheme, setScheme, toggleScheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside <ThemeProvider>.');
  }
  return context;
}
