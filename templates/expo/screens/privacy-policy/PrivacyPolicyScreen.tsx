import { ScrollView, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components';
import { makeStyles, typography, spacing } from '../../theme';
import { useTranslation } from '../../i18n';

export default function PrivacyPolicyScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.content}>{t('legal.privacyPolicy')}</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const useStyles = makeStyles((colors) => StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  content: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
}));
