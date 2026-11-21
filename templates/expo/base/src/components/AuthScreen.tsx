import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScreenWrapper } from './ScreenWrapper';
import { makeStyles, typography, spacing } from '../theme';

interface AuthScreenProps {
  emoji: string;
  emojiLabel?: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/** Shared layout for sign-in, sign-up, and password flows. */
export const AuthScreen: React.FC<AuthScreenProps> = ({
  emoji,
  emojiLabel,
  title,
  subtitle,
  children,
}) => {
  const styles = useStyles();

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.emoji} accessibilityLabel={emojiLabel}>
              {emoji}
            </Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.form}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const useStyles = makeStyles((colors) =>
  StyleSheet.create({
    flex: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    emoji: { fontSize: 48, marginBottom: spacing.md },
    title: {
      ...typography.h1,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    form: { gap: spacing.sm },
  })
);
