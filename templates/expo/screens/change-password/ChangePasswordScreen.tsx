import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppButton, AppInput } from '../../components';
import { makeStyles, typography, spacing } from '../../theme';
import { useChangePasswordMutation } from './api';
import { isStrongPassword } from '../../utils/validation';
import { useTranslation } from '../../i18n';

export default function ChangePasswordScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!currentPassword.trim())
      newErrors.currentPassword = t('validation.currentPasswordRequired');
    if (!newPassword.trim())
      newErrors.newPassword = t('validation.passwordRequired');
    else if (!isStrongPassword(newPassword))
      newErrors.newPassword = t('validation.passwordTooShort');
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = t('validation.passwordsDoNotMatch');
    if (currentPassword === newPassword)
      newErrors.newPassword = t('validation.passwordMustDiffer');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();
      Alert.alert(
        t('common.success'),
        t('auth.changePassword.successMessage'),
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } catch {
      Alert.alert(t('common.errorTitle'), t('auth.changePassword.error'));
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🔑</Text>
          <Text style={styles.title}>{t('auth.changePassword.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.changePassword.subtitle')}</Text>
        </View>

        <View style={styles.form}>
          <AppInput
            label={t('auth.changePassword.currentLabel')}
            placeholder={t('auth.changePassword.currentPlaceholder')}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            error={errors.currentPassword}
          />
          <AppInput
            label={t('auth.changePassword.newLabel')}
            placeholder={t('auth.changePassword.newPlaceholder')}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            error={errors.newPassword}
          />
          <AppInput
            label={t('auth.changePassword.confirmLabel')}
            placeholder={t('auth.changePassword.confirmPlaceholder')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />
          <AppButton
            title={t('auth.changePassword.submit')}
            onPress={handleSubmit}
            loading={isLoading}
            size="lg"
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const useStyles = makeStyles((colors) => StyleSheet.create({
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  form: { gap: spacing.sm },
}));
