import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppButton, AppCard, LoadingSpinner } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useGetProfileQuery } from '../../api/apiSlice';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/signin');
  };

  if (isLoading) return <LoadingSpinner fullScreen message="Loading profile..." />;

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar & Name */}
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: profile?.avatar || 'https://i.pravatar.cc/150?img=68' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile?.name || 'User'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
        </View>

        {/* Info Cards */}
        <AppCard style={styles.infoCard}>
          <InfoRow label="📧 Email" value={profile?.email || ''} />
          <InfoRow label="📱 Phone" value={profile?.phone || 'Not set'} />
          <InfoRow label="📍 Location" value={profile?.location || 'Not set'} />
          <InfoRow
            label="📅 Joined"
            value={profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : ''}
            isLast
          />
        </AppCard>

        {/* Actions */}
        <View style={styles.actions}>
          <AppButton
            title="Edit Profile"
            onPress={() => {}}
            variant="secondary"
          />
          <AppButton
            title="Settings"
            onPress={() => router.push('/(main)/settings')}
            variant="outline"
          />
          <AppButton
            title="Sign Out"
            onPress={handleLogout}
            variant="ghost"
            textStyle={{ color: colors.error }}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

function InfoRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[infoStyles.row, !isLast && infoStyles.border]}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  bio: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
});

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
});
