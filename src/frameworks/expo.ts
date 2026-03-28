import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from '../config.js';
import { getTemplatesDir, copyTemplateDir, screenIdToCases } from '../utils/file.js';
import { logger } from '../utils/logger.js';

export async function generateExpoProject(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const templatesDir = getTemplatesDir();
  const baseDir = path.join(templatesDir, 'expo', 'base');
  const screensDir = path.join(templatesDir, 'expo', 'screens');

  // Step 1: Copy base template
  logger.step(1, 4, 'Copying base Expo project...');
  await copyTemplateDir(baseDir, config.outputDir, context);

  // Step 2: Copy selected screen templates
  logger.step(2, 4, 'Adding selected screens...');
  for (const screenId of config.screens) {
    const screenSrcDir = path.join(screensDir, screenId);
    if (await fs.pathExists(screenSrcDir)) {
      // Copy screen component to features directory
      const screenDestDir = path.join(
        config.outputDir,
        'src',
        'features',
        screenId
      );
      await copyTemplateDir(screenSrcDir, screenDestDir, {
        ...context,
        ...screenIdToCases(screenId),
      });
    }
  }

  // Step 3: Generate dynamic route files in app/ directory
  logger.step(3, 4, 'Generating routes...');
  await generateExpoRoutes(config, context);

  // Step 4: Generate API slice with selected endpoints
  logger.step(4, 5, 'Setting up RTK Query API...');
  await generateRtkApiSlice(config, context);

  // Step 5: Run Expo prebuild for native folders
  logger.step(5, 5, 'Running Expo prebuild for native folders (this may take a minute)...');
  try {
    const { execSync } = await import('child_process');
    execSync('npx expo prebuild --no-install', {
      cwd: config.outputDir,
      stdio: 'inherit',
    });
  } catch (error) {
    logger.warn('Expo prebuild failed. You may need to run "npx expo prebuild" manually later.');
  }
}

async function generateExpoRoutes(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const appDir = path.join(config.outputDir, 'app');
  await fs.ensureDir(appDir);
  await fs.ensureDir(path.join(appDir, '(auth)'));
  await fs.ensureDir(path.join(appDir, '(main)'));

  // Root layout
  const rootLayout = `import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </Provider>
  );
}
`;
  await fs.writeFile(path.join(appDir, '_layout.tsx'), rootLayout);

  // Index redirect
  const indexContent = `import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(main)/profile' : '/(auth)/signin'} />;
}
`;
  await fs.writeFile(path.join(appDir, 'index.tsx'), indexContent);

  // Auth group layout
  const authLayout = `import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: '#6366F1',
        headerStyle: { backgroundColor: '#0F172A' },
        headerTitleStyle: { color: '#F8FAFC' },
        contentStyle: { backgroundColor: '#0F172A' },
      }}
    >
${config.screens.includes('signin') ? "      <Stack.Screen name=\"signin\" options={{ title: 'Sign In', headerShown: false }} />" : ''}
${config.screens.includes('signup') ? "      <Stack.Screen name=\"signup\" options={{ title: 'Sign Up' }} />" : ''}
${config.screens.includes('forgot-password') ? "      <Stack.Screen name=\"forgot-password\" options={{ title: 'Forgot Password' }} />" : ''}
    </Stack>
  );
}
`;
  await fs.writeFile(path.join(appDir, '(auth)', '_layout.tsx'), authLayout);

  // Main group layout
  const mainScreens: { id: string; title: string }[] = [];
  const mainScreenMap: Record<string, string> = {
    profile: 'Profile',
    settings: 'Settings',
    faq: 'FAQ',
    'privacy-policy': 'Privacy Policy',
    terms: 'Terms',
    about: 'About',
    notifications: 'Notifications',
    'change-password': 'Change Password',
    onboarding: 'Welcome',
  };

  for (const id of config.screens) {
    if (mainScreenMap[id]) {
      mainScreens.push({ id, title: mainScreenMap[id] });
    }
  }

  const mainLayout = `import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: '#6366F1',
        headerStyle: { backgroundColor: '#0F172A' },
        headerTitleStyle: { color: '#F8FAFC' },
        contentStyle: { backgroundColor: '#0F172A' },
      }}
    >
${mainScreens.map((s) => `      <Stack.Screen name="${s.id}" options={{ title: '${s.title}' }} />`).join('\n')}
    </Stack>
  );
}
`;
  await fs.writeFile(path.join(appDir, '(main)', '_layout.tsx'), mainLayout);

  // Generate route files for each screen
  const authScreens = ['signin', 'signup', 'forgot-password'];
  for (const screenId of config.screens) {
    const cases = screenIdToCases(screenId);
    const isAuth = authScreens.includes(screenId);
    const groupDir = isAuth ? '(auth)' : '(main)';

    const routeContent = `import ${cases.pascal}Screen from '../../src/features/${screenId}/${cases.pascal}Screen';

export default function ${cases.pascal}Route() {
  return <${cases.pascal}Screen />;
}
`;
    await fs.writeFile(
      path.join(appDir, groupDir, `${screenId}.tsx`),
      routeContent
    );
  }
}

async function generateRtkApiSlice(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const apiDir = path.join(config.outputDir, 'src', 'api');
  await fs.ensureDir(apiDir);

  // Build endpoint methods based on selected screens
  const endpoints: string[] = [];

  if (config.screens.includes('signin')) {
    endpoints.push(`    login: builder.mutation<LoginResponse, LoginRequest>({
      queryFn: async (credentials) => {
        await delay(800);
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          return { data: mockData.auth.login.success };
        }
        return { error: { status: 401, data: mockData.auth.login.error } };
      },
    })`);
  }

  if (config.screens.includes('signup')) {
    endpoints.push(`    register: builder.mutation<MessageResponse, RegisterRequest>({
      queryFn: async (data) => {
        await delay(800);
        return { data: mockData.auth.register.success };
      },
    })`);
  }

  if (config.screens.includes('forgot-password')) {
    endpoints.push(`    forgotPassword: builder.mutation<MessageResponse, { email: string }>({
      queryFn: async () => {
        await delay(800);
        return { data: mockData.auth.forgotPassword.success };
      },
    })`);
  }

  if (config.screens.includes('profile')) {
    endpoints.push(`    getProfile: builder.query<UserProfile, void>({
      queryFn: async () => {
        await delay(500);
        return { data: mockData.user.profile };
      },
      providesTags: ['Profile'],
    })`);
    endpoints.push(`    updateProfile: builder.mutation<MessageResponse, Partial<UserProfile>>({
      queryFn: async () => {
        await delay(800);
        return { data: mockData.user.updateProfile.success };
      },
      invalidatesTags: ['Profile'],
    })`);
  }

  if (config.screens.includes('faq')) {
    endpoints.push(`    getFaq: builder.query<FaqItem[], void>({
      queryFn: async () => {
        await delay(500);
        return { data: mockData.faq.items };
      },
    })`);
  }

  if (config.screens.includes('notifications')) {
    endpoints.push(`    getNotifications: builder.query<NotificationItem[], void>({
      queryFn: async () => {
        await delay(500);
        return { data: mockData.notifications.items };
      },
      providesTags: ['Notifications'],
    })`);
  }

  if (config.screens.includes('change-password')) {
    endpoints.push(`    changePassword: builder.mutation<MessageResponse, ChangePasswordRequest>({
      queryFn: async () => {
        await delay(800);
        return { data: { message: 'Password changed successfully' } };
      },
    })`);
  }

  // Build type imports based on screens
  const types: string[] = ['MessageResponse'];
  if (config.screens.includes('signin')) types.push('LoginRequest', 'LoginResponse');
  if (config.screens.includes('signup')) types.push('RegisterRequest');
  if (config.screens.includes('profile')) types.push('UserProfile');
  if (config.screens.includes('faq')) types.push('FaqItem');
  if (config.screens.includes('notifications')) types.push('NotificationItem');
  if (config.screens.includes('change-password')) types.push('ChangePasswordRequest');

  // Build hook exports
  const hooks: string[] = [];
  if (config.screens.includes('signin')) hooks.push('useLoginMutation');
  if (config.screens.includes('signup')) hooks.push('useRegisterMutation');
  if (config.screens.includes('forgot-password')) hooks.push('useForgotPasswordMutation');
  if (config.screens.includes('profile')) hooks.push('useGetProfileQuery', 'useUpdateProfileMutation');
  if (config.screens.includes('faq')) hooks.push('useGetFaqQuery');
  if (config.screens.includes('notifications')) hooks.push('useGetNotificationsQuery');
  if (config.screens.includes('change-password')) hooks.push('useChangePasswordMutation');

  const tags: string[] = [];
  if (config.screens.includes('profile')) tags.push("'Profile'");
  if (config.screens.includes('notifications')) tags.push("'Notifications'");

  const apiSlice = `import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockData } from './mockData';
import type { ${types.join(', ')} } from './types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: [${tags.join(', ')}],
  endpoints: (builder) => ({
${endpoints.join(',\n\n')},
  }),
});

export const {
  ${hooks.join(',\n  ')},
} = api;
`;

  await fs.writeFile(path.join(apiDir, 'apiSlice.ts'), apiSlice);
}
