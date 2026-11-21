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
  await generateExpoRoutes(config);

  // Step 4: Generate API slice with selected endpoints
  logger.step(4, 4, 'Setting up RTK Query API...');
  await generateApiLayer(config);
}

async function generateExpoRoutes(config: ProjectConfig): Promise<void> {
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
}

interface ApiModule {
  name: string;
  imports: string[];
  endpoints: string[];
  hooks: string[];
  usesMockData: boolean;
}

async function generateApiLayer(config: ProjectConfig): Promise<void> {
  const apiDir = path.join(config.outputDir, 'src', 'api');
  await fs.ensureDir(apiDir);

  const baseApi = `import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Profile', 'Notifications'],
  endpoints: () => ({}),
});
`;
  await fs.writeFile(path.join(apiDir, 'baseApi.ts'), baseApi, 'utf-8');

  const modules: Record<string, ApiModule> = {};

  if (config.screens.includes('signin')) {
    modules.signin = {
      name: 'signInApi',
      usesMockData: true,
      imports: [
        "import type { LoginRequest, LoginResponse } from '../../api/types';",
      ],
      hooks: ['useLoginMutation'],
      endpoints: [
        `    login: builder.mutation<LoginResponse, LoginRequest>({
      queryFn: async (credentials) => {
        await delay(800);
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          return { data: mockData.auth.login.success };
        }
        return { error: { status: 401, data: mockData.auth.login.error } };
      },
    })`,
      ],
    };
  }

  if (config.screens.includes('signup')) {
    modules.signup = {
      name: 'signUpApi',
      usesMockData: true,
      imports: [
        "import type { MessageResponse, RegisterRequest } from '../../api/types';",
      ],
      hooks: ['useRegisterMutation'],
      endpoints: [
        `    register: builder.mutation<MessageResponse, RegisterRequest>({
      queryFn: async () => {
        await delay(800);
        return { data: mockData.auth.register.success };
      },
    })`,
      ],
    };
  }

  if (config.screens.includes('forgot-password')) {
    modules['forgot-password'] = {
      name: 'forgotPasswordApi',
      usesMockData: true,
      imports: ["import type { MessageResponse } from '../../api/types';"],
      hooks: ['useForgotPasswordMutation'],
      endpoints: [
        `    forgotPassword: builder.mutation<MessageResponse, { email: string }>({
      queryFn: async () => {
        await delay(800);
        return { data: mockData.auth.forgotPassword.success };
      },
    })`,
      ],
    };
  }

  if (config.screens.includes('change-password')) {
    modules['change-password'] = {
      name: 'changePasswordApi',
      usesMockData: false,
      imports: [
        "import type { ChangePasswordRequest, MessageResponse } from '../../api/types';",
      ],
      hooks: ['useChangePasswordMutation'],
      endpoints: [
        `    changePassword: builder.mutation<MessageResponse, ChangePasswordRequest>({
      queryFn: async () => {
        await delay(800);
        return { data: { message: 'Password changed successfully' } };
      },
    })`,
      ],
    };
  }

  if (config.screens.includes('profile')) {
    modules.profile = {
      name: 'profileApi',
      usesMockData: true,
      imports: [
        "import type { MessageResponse, UserProfile } from '../../api/types';",
      ],
      hooks: ['useGetProfileQuery', 'useUpdateProfileMutation'],
      endpoints: [
        `    getProfile: builder.query<UserProfile, void>({
      queryFn: async () => {
        await delay(500);
        return { data: mockData.user.profile };
      },
      providesTags: ['Profile'],
    })`,
        `    updateProfile: builder.mutation<MessageResponse, Partial<UserProfile>>({
      queryFn: async () => {
        await delay(800);
        return { data: mockData.user.updateProfile.success };
      },
      invalidatesTags: ['Profile'],
    })`,
      ],
    };
  }

  if (config.screens.includes('faq')) {
    modules.faq = {
      name: 'faqApi',
      usesMockData: true,
      imports: ["import type { FaqItem } from '../../api/types';"],
      hooks: ['useGetFaqQuery'],
      endpoints: [
        `    getFaq: builder.query<FaqItem[], void>({
      queryFn: async () => {
        await delay(500);
        return { data: mockData.faq.items };
      },
    })`,
      ],
    };
  }

  if (config.screens.includes('notifications')) {
    modules.notifications = {
      name: 'notificationsApi',
      usesMockData: true,
      imports: ["import type { NotificationItem } from '../../api/types';"],
      hooks: ['useGetNotificationsQuery'],
      endpoints: [
        `    getNotifications: builder.query<NotificationItem[], void>({
      queryFn: async () => {
        await delay(500);
        return { data: mockData.notifications.items as NotificationItem[] };
      },
      providesTags: ['Notifications'],
    })`,
      ],
    };
  }

  for (const [screenId, apiModule] of Object.entries(modules)) {
    const imports = [
      "import { baseApi } from '../../api/baseApi';",
      apiModule.usesMockData
        ? "import { mockData } from '../../api/mockData';"
        : null,
      ...apiModule.imports,
    ]
      .filter(Boolean)
      .join('\n');

    const content = `${imports}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ${apiModule.name} = baseApi.injectEndpoints({
  endpoints: (builder) => ({
${apiModule.endpoints.join(',\n\n')},
  }),
});

export const {
  ${apiModule.hooks.join(',\n  ')},
} = ${apiModule.name};
`;

    await fs.writeFile(
      path.join(config.outputDir, 'src', 'features', screenId, 'api.ts'),
      content,
      'utf-8'
    );
  }
}
