import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreen, AppButton, AppInput } from '../../components';
import { useForgotPasswordMutation } from './api';
import { getErrorMessage } from '../../utils/errors';
import { useTranslation } from '../../i18n';
import { isEmail } from '../../utils/validation';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError(t('validation.emailRequired'));
      return;
    }
    if (!isEmail(email)) {
      setError(t('validation.emailInvalid'));
      return;
    }
    setError('');

    try {
      await forgotPassword({ email }).unwrap();
      Alert.alert(t('common.success'), t('auth.forgot.successMessage'), [
        { text: t('auth.forgot.backToSignIn'), onPress: () => router.back() },
      ]);
    } catch (error: unknown) {
      Alert.alert(
        t('common.errorTitle'),
        getErrorMessage(error, t('common.errorGeneric'))
      );
    }
  };

  return (
    <AuthScreen
      emoji="🔐"
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
    >
      <AppInput
        label={t('auth.signIn.emailLabel')}
        placeholder={t('auth.signIn.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={error}
      />

      <AppButton
        title={t('auth.forgot.submit')}
        onPress={handleSubmit}
        loading={isLoading}
        size="lg"
      />

      <AppButton
        title={t('auth.forgot.backToSignIn')}
        onPress={() => router.back()}
        variant="ghost"
      />
    </AuthScreen>
  );
}
