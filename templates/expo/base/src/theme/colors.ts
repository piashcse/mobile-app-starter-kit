import { Appearance } from 'react-native';

const darkColors = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#06B6D4',
  accentLight: '#22D3EE',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: '#334155',
  borderLight: '#475569',
  overlay: 'rgba(0, 0, 0, 0.5)',
  gradientStart: '#6366F1',
  gradientEnd: '#8B5CF6',
} as const;

const lightColors: Record<keyof typeof darkColors, string> = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  accent: '#06B6D4',
  accentLight: '#22D3EE',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: '#E2E8F0',
  borderLight: '#CBD5E1',
  overlay: 'rgba(0, 0, 0, 0.2)',
  gradientStart: '#6366F1',
  gradientEnd: '#8B5CF6',
};

// Default export uses current system appearance
export const colors = Appearance.getColorScheme() === 'light' ? lightColors : darkColors;

// Export raw palettes for context-based theming (e.g. useColorScheme hook wrapper)
export const ThemeColors = {
  light: lightColors,
  dark: darkColors,
};

export type ColorKey = keyof typeof darkColors;
