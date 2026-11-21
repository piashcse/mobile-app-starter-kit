import { useMemo } from 'react';
import type { AppColors } from './colors';
import { useAppTheme } from './ThemeProvider';

/**
 * Build a hook that re-creates styles whenever the active palette changes.
 * The factory must call `StyleSheet.create` so React Native can infer literal
 * style types. Define the returned hook at module scope.
 *
 * const useStyles = makeStyles((colors) =>
 *   StyleSheet.create({ title: { color: colors.textPrimary } })
 * );
 */
export function makeStyles<T>(factory: (colors: AppColors) => T): () => T {
  return function useStyles(): T {
    const { colors } = useAppTheme();
    return useMemo(() => factory(colors), [colors]);
  };
}
