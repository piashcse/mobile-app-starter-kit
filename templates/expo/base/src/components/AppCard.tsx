import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { makeStyles } from '../theme';
import { borderRadius, spacing } from '../theme/spacing';

interface AppCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  variant = 'default',
}) => {
  const styles = useStyles();
  return (
    <View style={[styles.base, styles[variant], style]}>{children}</View>
  );
};

const useStyles = makeStyles((colors) => StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  default: {
    backgroundColor: colors.surface,
  },
  elevated: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
}));
