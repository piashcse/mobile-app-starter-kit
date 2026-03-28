import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ScreenWrapper, AppCard, LoadingSpinner } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useGetNotificationsQuery } from '../../api/apiSlice';

const typeColors = {
  info: colors.info,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
};

export default function NotificationsScreen() {
  const { data: notifications, isLoading } = useGetNotificationsQuery();

  if (isLoading) return <LoadingSpinner fullScreen message="Loading notifications..." />;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <AppCard
              style={[styles.card, !item.read && styles.unreadCard]}
              variant={item.read ? 'default' : 'elevated'}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: typeColors[item.type] || colors.info },
                  ]}
                />
                <Text style={styles.cardTitle}>{item.title}</Text>
                {!item.read && <View style={styles.unreadBadge} />}
              </View>
              <Text style={styles.cardBody}>{item.body}</Text>
              <Text style={styles.cardTime}>
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </AppCard>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔔</Text>
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  list: { gap: spacing.sm, paddingBottom: spacing.xxl },
  card: { marginBottom: 0 },
  unreadCard: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs, gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cardTitle: { ...typography.subtitle, color: colors.textPrimary, flex: 1 },
  unreadBadge: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  cardBody: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  cardTime: { ...typography.caption, color: colors.textMuted },
  empty: { alignItems: 'center', paddingTop: spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { ...typography.body, color: colors.textMuted },
});
