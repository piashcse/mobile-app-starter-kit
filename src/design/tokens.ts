/**
 * Single source of truth for the design system emitted into every generated
 * project. Keep primitive values here; platform theme files are generated from
 * this module so the three templates cannot drift.
 */

export interface ColorRole {
  primary: string;
  primaryPressed: string;
  primaryLight: string;
  onPrimary: string;
  accent: string;
  accentLight: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  overlay: string;
  gradientStart: string;
  gradientEnd: string;
}

export const lightColors: ColorRole = {
  primary: '#6366F1',
  primaryPressed: '#4F46E5',
  primaryLight: '#818CF8',
  onPrimary: '#FFFFFF',
  accent: '#06B6D4',
  accentLight: '#0891B2',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#CBD5E1',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  overlay: 'rgba(15, 23, 42, 0.4)',
  gradientStart: '#6366F1',
  gradientEnd: '#8B5CF6',
};

export const darkColors: ColorRole = {
  primary: '#6366F1',
  primaryPressed: '#4F46E5',
  primaryLight: '#818CF8',
  onPrimary: '#FFFFFF',
  accent: '#06B6D4',
  accentLight: '#22D3EE',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceAlt: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#334155',
  borderLight: '#475569',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  overlay: 'rgba(0, 0, 0, 0.5)',
  gradientStart: '#6366F1',
  gradientEnd: '#8B5CF6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export interface TypeStyle {
  size: number;
  lineHeight: number;
  weight: '400' | '500' | '600' | '700';
  letterSpacing?: number;
}

export const typography: Record<
  | 'display'
  | 'title'
  | 'heading'
  | 'subtitle'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'button',
  TypeStyle
> = {
  display: { size: 32, lineHeight: 40, weight: '700', letterSpacing: -0.5 },
  title: { size: 24, lineHeight: 32, weight: '700', letterSpacing: -0.3 },
  heading: { size: 20, lineHeight: 28, weight: '600' },
  subtitle: { size: 16, lineHeight: 24, weight: '600' },
  body: { size: 16, lineHeight: 24, weight: '400' },
  bodySmall: { size: 14, lineHeight: 20, weight: '400' },
  caption: { size: 12, lineHeight: 16, weight: '400' },
  label: { size: 14, lineHeight: 20, weight: '500' },
  button: { size: 16, lineHeight: 24, weight: '600', letterSpacing: 0.3 },
};

export const componentTokens = {
  buttonHeight: 52,
  buttonRadius: radii.md,
  buttonLabelSize: 16,
  inputHeight: 52,
  inputRadius: radii.md,
  inputBorderWidth: 1.5,
  cardRadius: radii.lg,
  cardPadding: spacing.md,
  screenPadding: spacing.lg,
  sectionGap: spacing.lg,
  iconSize: 24,
  touchTarget: 48,
} as const;

export const motion = {
  fast: 150,
  normal: 250,
} as const;

export const designTokens = {
  colors: { light: lightColors, dark: darkColors },
  spacing,
  radii,
  typography,
  components: componentTokens,
  motion,
} as const;

export type DesignTokens = typeof designTokens;
