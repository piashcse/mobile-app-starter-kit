import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { makeStyles, typography, spacing } from '../theme';
import { supportedLocales, useTranslation } from '../i18n';

export const LanguageSwitcher: React.FC = () => {
  const styles = useStyles();
  const { locale, setLocale, t } = useTranslation();

  return (
    <View style={styles.container} accessibilityRole="toolbar">
      <Text style={styles.label}>{t('common.language')}:</Text>
      {supportedLocales.map((entry) => (
        <Pressable
          key={entry.code}
          onPress={() => setLocale(entry.code)}
          accessibilityRole="button"
          accessibilityState={{ selected: locale === entry.code }}
        >
          <Text
            style={[
              styles.option,
              locale === entry.code && styles.active,
            ]}
          >
            {entry.nativeLabel}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const useStyles = makeStyles((colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  label: { ...typography.bodySmall, color: colors.textMuted },
  option: { ...typography.bodySmall, color: colors.primary },
  active: { ...typography.label, color: colors.primary },
}));
