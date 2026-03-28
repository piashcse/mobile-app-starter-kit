import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ScreenWrapper, LoadingSpinner } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useGetFaqQuery } from '../../api/apiSlice';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FaqScreen() {
  const { data: faqItems, isLoading } = useGetFaqQuery();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) return <LoadingSpinner fullScreen message="Loading FAQ..." />;

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.emoji}>❓</Text>
          <Text style={styles.title}>Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>Find answers to common questions</Text>
        </View>

        <View style={styles.list}>
          {faqItems?.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.faqItem,
                expandedId === item.id && styles.faqItemExpanded,
              ]}
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.questionRow}>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.chevron}>
                  {expandedId === item.id ? '−' : '+'}
                </Text>
              </View>
              {expandedId === item.id && (
                <Text style={styles.answer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: { fontSize: 40, marginBottom: spacing.sm },
  title: { ...typography.h2, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  list: { gap: spacing.sm },
  faqItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqItemExpanded: {
    borderColor: colors.primary,
    backgroundColor: colors.surface + 'CC',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    ...typography.subtitle,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  chevron: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '700',
  },
  answer: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 22,
  },
});
