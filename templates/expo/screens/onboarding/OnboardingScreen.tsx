import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppButton } from '../../components';
import { colors, typography, spacing } from '../../theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    emoji: '🚀',
    title: 'Welcome',
    description: 'Discover a new way to manage your life with our powerful and intuitive app.',
  },
  {
    id: '2',
    emoji: '🔒',
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected with industry-leading security standards.',
  },
  {
    id: '3',
    emoji: '⚡',
    title: 'Fast & Reliable',
    description: 'Built with performance in mind. Experience lightning-fast interactions.',
  },
  {
    id: '4',
    emoji: '🎯',
    title: 'Get Started',
    description: 'Create your account and start your journey today!',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(auth)/signin');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/signin');
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.skipContainer}>
          {currentIndex < slides.length - 1 && (
            <AppButton title="Skip" onPress={handleSkip} variant="ghost" size="sm" />
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        <View style={styles.footer}>
          <AppButton
            title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            size="lg"
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipContainer: { alignItems: 'flex-end', padding: spacing.md },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emoji: { fontSize: 80, marginBottom: spacing.xl },
  title: { ...typography.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.md },
  description: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  footer: { padding: spacing.lg },
});
