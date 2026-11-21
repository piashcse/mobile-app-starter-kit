import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles, useAppTheme } from '../theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  withSafeArea?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  withSafeArea = true,
}) => {
  const styles = useStyles();
  const { isDark } = useAppTheme();
  const Container = withSafeArea ? SafeAreaView : View;

  return (
    <Container style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>{children}</View>
    </Container>
  );
};

const useStyles = makeStyles((colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: { flex: 1 },
}));
