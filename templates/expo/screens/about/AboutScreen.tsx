import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { ScreenWrapper, AppButton, AppCard } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { mockData } from '../../api/mockData';

export default function AboutScreen() {
  const about = mockData.app.about;

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.emoji}>📱</Text>
          <Text style={styles.appName}>{{projectName}}</Text>
          <Text style={styles.version}>Version {about.version} ({about.buildNumber})</Text>
        </View>

        <AppCard style={styles.card}>
          <Text style={styles.description}>{about.description}</Text>
        </AppCard>

        <AppCard style={styles.card}>
          <InfoRow icon="🌐" label="Website" value={about.website} />
          <InfoRow icon="📧" label="Support" value={about.supportEmail} isLast />
        </AppCard>

        <View style={styles.actions}>
          <AppButton
            title="Visit Website"
            onPress={() => Linking.openURL(about.website)}
            variant="outline"
          />
          <AppButton
            title="Contact Support"
            onPress={() => Linking.openURL(`mailto:${about.supportEmail}`)}
            variant="secondary"
          />
        </View>

        <Text style={styles.copyright}>
          © {new Date().getFullYear()} All rights reserved.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

function InfoRow({ icon, label, value, isLast = false }: { icon: string; label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[infoStyles.row, !isLast && infoStyles.border]}>
      <Text style={infoStyles.icon}>{icon}</Text>
      <View>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  emoji: { fontSize: 60, marginBottom: spacing.md },
  appName: { ...typography.h1, color: colors.textPrimary },
  version: { ...typography.bodySmall, color: colors.textMuted, marginTop: spacing.xs },
  card: { marginBottom: spacing.md },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  actions: { gap: spacing.sm, marginTop: spacing.md },
  copyright: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  border: { borderBottomWidth: 1, borderBottomColor: colors.border },
  icon: { fontSize: 24 },
  label: { ...typography.caption, color: colors.textMuted },
  value: { ...typography.body, color: colors.textPrimary },
});
