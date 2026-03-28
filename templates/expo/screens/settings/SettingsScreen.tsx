import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppCard } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface SettingItem {
  id: string;
  label: string;
  icon: string;
  type: 'toggle' | 'navigate' | 'action';
  route?: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    biometrics: false,
    analytics: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', label: 'Push Notifications', icon: '🔔', type: 'toggle' as const },
        { id: 'darkMode', label: 'Dark Mode', icon: '🌙', type: 'toggle' as const },
        { id: 'biometrics', label: 'Biometric Login', icon: '🔒', type: 'toggle' as const },
        { id: 'analytics', label: 'Usage Analytics', icon: '📊', type: 'toggle' as const },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'change-password', label: 'Change Password', icon: '🔑', type: 'navigate' as const, route: '/(main)/change-password' },
        { id: 'privacy-policy', label: 'Privacy Policy', icon: '🛡️', type: 'navigate' as const, route: '/(main)/privacy-policy' },
        { id: 'terms', label: 'Terms of Service', icon: '📄', type: 'navigate' as const, route: '/(main)/terms' },
        { id: 'faq', label: 'FAQ', icon: '❓', type: 'navigate' as const, route: '/(main)/faq' },
        { id: 'about', label: 'About', icon: 'ℹ️', type: 'navigate' as const, route: '/(main)/about' },
      ],
    },
  ];

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <AppCard>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.row,
                    index < section.items.length - 1 && styles.rowBorder,
                  ]}
                  onPress={() => {
                    if (item.type === 'navigate' && item.route) {
                      router.push(item.route as any);
                    }
                  }}
                  activeOpacity={item.type === 'toggle' ? 1 : 0.7}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowIcon}>{item.icon}</Text>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={settings[item.id as keyof typeof settings]}
                      onValueChange={() => toggleSetting(item.id as keyof typeof settings)}
                      trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
                      thumbColor={
                        settings[item.id as keyof typeof settings]
                          ? colors.primary
                          : colors.textMuted
                      }
                    />
                  ) : (
                    <Text style={styles.chevron}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </AppCard>
          </View>
        ))}

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowIcon: {
    fontSize: 20,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
