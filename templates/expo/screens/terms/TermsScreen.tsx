import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components';
import { colors, typography, spacing } from '../../theme';
import { mockData } from '../../api/mockData';

export default function TermsScreen() {
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.content}>{mockData.app.terms}</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  content: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
