// Theme Colors — Premium dark palette with indigo accents
export const colors = {
  // Primary
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',

  // Background
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Accent
  accent: '#06B6D4',
  accentLight: '#22D3EE',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Borders
  border: '#334155',
  borderLight: '#475569',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Gradient
  gradientStart: '#6366F1',
  gradientEnd: '#8B5CF6',
} as const;

export type ColorKey = keyof typeof colors;
