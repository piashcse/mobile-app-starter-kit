export type Framework = 'expo' | 'flutter' | 'kmp';

export interface ScreenConfig {
  id: string;
  name: string;
  description: string;
  category: 'auth' | 'user' | 'onboarding' | 'info' | 'feature';
  defaultIncluded: boolean;
}

export interface ProjectConfig {
  name: string;
  framework: Framework;
  screens: string[];
  packageName: string;
  outputDir: string;
}

export const FRAMEWORKS: { id: Framework; name: string; description: string }[] = [
  {
    id: 'expo',
    name: 'Expo React Native',
    description: 'React Native with Expo, RTK Query, Zustand, and Expo Router',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    description: 'Flutter with Clean Architecture, Riverpod, GoRouter, and Dio',
  },
  {
    id: 'kmp',
    name: 'KMP (Kotlin Multiplatform)',
    description: 'Compose Multiplatform with MVVM, Voyager, and Ktor',
  },
];

export const SCREENS: ScreenConfig[] = [
  {
    id: 'signin',
    name: 'Sign In',
    description: 'Email/password login screen',
    category: 'auth',
    defaultIncluded: true,
  },
  {
    id: 'signup',
    name: 'Sign Up',
    description: 'User registration with validation',
    category: 'auth',
    defaultIncluded: true,
  },
  {
    id: 'forgot-password',
    name: 'Forgot Password',
    description: 'Password reset via email',
    category: 'auth',
    defaultIncluded: true,
  },
  {
    id: 'change-password',
    name: 'Change Password',
    description: 'Change existing password',
    category: 'auth',
    defaultIncluded: false,
  },
  {
    id: 'profile',
    name: 'Profile',
    description: 'User profile view and edit',
    category: 'user',
    defaultIncluded: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'App settings with toggle switches',
    category: 'user',
    defaultIncluded: true,
  },
  {
    id: 'onboarding',
    name: 'Onboarding',
    description: 'Swipeable intro/welcome slides',
    category: 'onboarding',
    defaultIncluded: false,
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Expandable FAQ accordion list',
    category: 'info',
    defaultIncluded: true,
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    description: 'Static privacy policy content',
    category: 'info',
    defaultIncluded: true,
  },
  {
    id: 'terms',
    name: 'Terms & Conditions',
    description: 'Terms of service content',
    category: 'info',
    defaultIncluded: false,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Notification list with read/unread states',
    category: 'feature',
    defaultIncluded: false,
  },
  {
    id: 'about',
    name: 'About',
    description: 'App info, version, and links',
    category: 'info',
    defaultIncluded: false,
  },
];

export const DEFAULT_SCREENS = SCREENS
  .filter((s) => s.defaultIncluded)
  .map((s) => s.id);
