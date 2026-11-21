import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppButton, AppInput } from '../../components';
import { makeStyles, typography, spacing } from '../../theme';
import { useRegisterMutation } from './api';
import { getErrorMessage } from '../../utils/errors';
import { useTranslation } from '../../i18n';
import { isEmail, isStrongPassword } from '../../utils/validation';

export default function SignUpScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [register, { isLoading }] = useRegisterMutation();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t('validation.nameRequired');
    if (!email.trim()) newErrors.email = t('validation.emailRequired');
    else if (!isEmail(email)) newErrors.email = t('validation.emailInvalid');
    if (!password.trim()) newErrors.password = t('validation.passwordRequired');
    else if (!isStrongPassword(password))
      newErrors.password = t('validation.passwordTooShort');
    if (password !== confirmPassword)
      newErrors.confirmPassword = t('validation.passwordsDoNotMatch');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    try {
      await register({ name, email, password }).unwrap();
      Alert.alert(t('common.success'), t('auth.signUp.successMessage'), [
        { text: t('auth.signIn.submit'), onPress: () => router.back() },
      ]);
    } catch (error: unknown) {
      Alert.alert(
        t('common.errorTitle'),
        getErrorMessage(error, t('auth.signUp.error'))
      );
    }
  };

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
            <Text style={styles.emoji}>🚀</Text>
            <Text style={styles.title}>{t('auth.signUp.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.signUp.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <AppInput
              label={t('auth.signUp.nameLabel')}
              placeholder={t('auth.signUp.namePlaceholder')}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              error={errors.name}
            />

            <AppInput
              label={t('auth.signIn.emailLabel')}
              placeholder={t('auth.signIn.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <AppInput
              label={t('auth.signIn.passwordLabel')}
              placeholder={t('auth.signUp.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <AppInput
              label={t('auth.signUp.confirmPasswordLabel')}
              placeholder={t('auth.signUp.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirmPassword}
            />

            <AppButton
              title={t('auth.signUp.submit')}
              onPress={handleSignUp}
              loading={isLoading}
              size="lg"
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.signUp.signInPrompt')}</Text>
            <AppButton
              title={t('auth.signUp.signInAction')}
              onPress={() => router.back()}
              variant="ghost"
              size="sm"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const useStyles = makeStyles((colors) => StyleSheet.create({
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
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  form: { gap: spacing.sm },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  footerText: { ...typography.body, color: colors.textSecondary },
}));
