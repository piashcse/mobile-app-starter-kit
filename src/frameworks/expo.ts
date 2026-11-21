import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from '../config.js';
import { AUTH_SCREENS } from '../config.js';
import {
  getTemplatesDir,
  copyTemplateDir,
  screenIdToCases,
} from '../utils/file.js';
import { logger } from '../utils/logger.js';
import { writeExpoDesign, writeExpoI18n } from '../design/generate.js';

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
  await writeExpoDesign(config.outputDir);
  await writeExpoI18n(config.outputDir);

  // Step 2: Copy selected screen templates
  logger.step(2, 4, 'Adding selected screens...');
  for (const screenId of config.screens) {
    const screenSrcDir = path.join(screensDir, screenId);
    if (!(await fs.pathExists(screenSrcDir))) {
      throw new Error(
        `Missing Expo template for screen "${screenId}" (${screenSrcDir}).`
      );
    }
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

  // Step 3: Generate dynamic route files in app/ directory
  logger.step(3, 4, 'Generating routes...');
  await generateExpoRoutes(config, context);

  // Step 4: Generate API slice with selected endpoints
  logger.step(4, 4, 'Setting up RTK Query API...');
  await generateRtkApiSlice(config);
}

async function generateExpoRoutes(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const appDir = path.join(config.outputDir, 'app');
  await fs.ensureDir(appDir);

  const authScreens = config.screens.filter((s) =>
    AUTH_SCREENS.includes(s as (typeof AUTH_SCREENS)[number])
  );
  const mainScreens = config.screens.filter((s) => !authScreens.includes(s));
  const hasAuth = authScreens.length > 0;
  const hasMain = mainScreens.length > 0;

  const firstAuth = authScreens[0] ? screenIdToCases(authScreens[0]).kebab : '';
  const firstMain = mainScreens[0] ? screenIdToCases(mainScreens[0]).kebab : '';
  const firstNonOnboarding =
    mainScreens.find((s) => s !== 'onboarding') ?? mainScreens[0] ?? '';
  const postAuth = firstNonOnboarding || firstMain || firstAuth;

  // Root layout
  const rootLayout = `import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '../src/store/store';
import { useAuthStore } from '../src/store/authStore';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { I18nProvider } from '../src/i18n';

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <I18nProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              ${hasAuth ? '<Stack.Screen name="(auth)" />' : ''}
              ${hasMain ? '<Stack.Screen name="(main)" />' : ''}
            </Stack>
          </ThemeProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
`;
  await fs.writeFile(path.join(appDir, '_layout.tsx'), rootLayout);

  // Index redirect logic
  const authenticatedRedirect = hasMain
    ? `return <Redirect href="/(main)/${postAuth}" />;`
    : `return <Redirect href="/(auth)/${firstAuth}" />;`;

  const unauthenticatedRedirect = hasAuth
    ? `return <Redirect href="/(auth)/${firstAuth}" />;`
    : hasMain
      ? `return <Redirect href="/(main)/${firstMain}" />;`
      : 'return null;';

  const indexContent = `import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // Wait for the persisted session to load before choosing a route.
  if (!hasHydrated) return null;

  if (isAuthenticated) {
    ${authenticatedRedirect}
  }

  // New users see onboarding first when it is part of the project.
  ${
    mainScreens.includes('onboarding')
      ? 'return <Redirect href="/(main)/onboarding" />;'
      : unauthenticatedRedirect
  }
}
`;
  await fs.writeFile(path.join(appDir, 'index.tsx'), indexContent);

  // Auth group layout
  if (hasAuth) {
    const authDir = path.join(appDir, '(auth)');
    await fs.ensureDir(authDir);
    const authLayout = `import { Stack } from 'expo-router';
import { useAppTheme } from '../../src/theme';

export default function AuthLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.textPrimary },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
${authScreens
  .map((id) => {
    const cases = screenIdToCases(id);
    const isFirst = id === authScreens[0];
    return `      <Stack.Screen name="${id}" options={{ title: '${cases.title}'${
      isFirst ? ', headerShown: false' : ''
    } }} />`;
  })
  .join('\n')}
    </Stack>
  );
}
`;
    await fs.writeFile(path.join(authDir, '_layout.tsx'), authLayout);
  }

  // Main group layout
  if (hasMain) {
    const mainDir = path.join(appDir, '(main)');
    await fs.ensureDir(mainDir);
    const mainLayout = `import { Stack } from 'expo-router';
import { useAppTheme } from '../../src/theme';

export default function MainLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.textPrimary },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
${mainScreens
  .map((id) => {
    const cases = screenIdToCases(id);
    return `      <Stack.Screen name="${id}" options={{ title: '${cases.title}'${
      id === 'onboarding' ? ', headerShown: false' : ''
    } }} />`;
  })
  .join('\n')}
    </Stack>
  );
}
`;
    await fs.writeFile(path.join(mainDir, '_layout.tsx'), mainLayout);
  }

  // Generate route files for each screen
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

  // Keep generated files from referencing screens that were not selected.
  void context;
}

async function generateRtkApiSlice(config: ProjectConfig): Promise<void> {
  const apiDir = path.join(config.outputDir, 'src', 'api');
  await fs.ensureDir(apiDir);

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
      queryFn: async () => {
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
        return { data: mockData.notifications.items as NotificationItem[] };
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

  const types: string[] = ['MessageResponse'];
  if (config.screens.includes('signin'))
    types.push('LoginRequest', 'LoginResponse');
  if (config.screens.includes('signup')) types.push('RegisterRequest');
  if (config.screens.includes('profile')) types.push('UserProfile');
  if (config.screens.includes('faq')) types.push('FaqItem');
  if (config.screens.includes('notifications')) types.push('NotificationItem');
  if (config.screens.includes('change-password'))
    types.push('ChangePasswordRequest');

  const hooks: string[] = [];
  if (config.screens.includes('signin')) hooks.push('useLoginMutation');
  if (config.screens.includes('signup')) hooks.push('useRegisterMutation');
  if (config.screens.includes('forgot-password'))
    hooks.push('useForgotPasswordMutation');
  if (config.screens.includes('profile'))
    hooks.push('useGetProfileQuery', 'useUpdateProfileMutation');
  if (config.screens.includes('faq')) hooks.push('useGetFaqQuery');
  if (config.screens.includes('notifications'))
    hooks.push('useGetNotificationsQuery');
  if (config.screens.includes('change-password'))
    hooks.push('useChangePasswordMutation');

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
