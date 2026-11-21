import fs from 'fs-extra';
import type { Framework, ProjectConfig } from './config.js';
import {
  ALL_SCREEN_IDS,
  AUTH_SCREENS,
  FRAMEWORKS,
  MAIN_SCREENS,
  SCREENS,
} from './config.js';
import { deriveProjectNames, screenIdToCases, toKebab } from './utils/file.js';
import { generateExpoProject } from './frameworks/expo.js';
import { generateFlutterProject } from './frameworks/flutter.js';
import { generateKmpProject } from './frameworks/kmp.js';
import { writeDesignTokensJson } from './design/generate.js';

export interface GenerationResult {
  outputDir: string;
  framework: Framework;
  screens: string[];
}

export async function generateProject(
  config: ProjectConfig
): Promise<GenerationResult> {
  const framework = FRAMEWORKS.find((f) => f.id === config.framework);
  if (!framework) {
    throw new Error(
      `Unknown framework "${config.framework}". Use one of: ${FRAMEWORKS.map(
        (f) => f.id
      ).join(', ')}.`
    );
  }

  if (config.screens.length === 0) {
    throw new Error('Select at least one screen to generate a project.');
  }

  await fs.ensureDir(config.outputDir);
  await writeDesignTokensJson(config.outputDir);

  const context = buildContext(config);

  try {
    switch (config.framework) {
      case 'expo':
        await generateExpoProject(config, context);
        break;
      case 'flutter':
        await generateFlutterProject(config, context);
        break;
      case 'kmp':
        await generateKmpProject(config, context);
        break;
    }
  } catch (error) {
    // Never leave a half-generated project behind.
    await fs.remove(config.outputDir).catch(() => undefined);
    throw error;
  }

  return {
    outputDir: config.outputDir,
    framework: config.framework,
    screens: [...config.screens],
  };
}

export function buildContext(config: ProjectConfig): Record<string, unknown> {
  const names = deriveProjectNames(config.name);
  const screens = config.screens.map((id) => ({
    ...screenIdToCases(id),
    id,
    name: SCREENS.find((s) => s.id === id)?.name ?? id,
    hasScreen: true,
  }));

  // Create boolean flags for each screen (hasSignIn, hasSignUp, etc.)
  const screenFlags: Record<string, boolean> = {};
  for (const id of ALL_SCREEN_IDS) {
    const cases = screenIdToCases(id);
    screenFlags[`has${cases.pascal}`] = config.screens.includes(id);
  }

  // Package name parts
  const packageParts = config.packageName.split('.');
  const firstAuth = AUTH_SCREENS.find((s) => config.screens.includes(s));
  const nonOnboardingMain = MAIN_SCREENS.find(
    (s) => s !== 'onboarding' && config.screens.includes(s)
  );
  const firstMain =
    nonOnboardingMain ??
    MAIN_SCREENS.find((s) => config.screens.includes(s)) ??
    config.screens.find((s) => !AUTH_SCREENS.includes(s as never));

  const postAuthScreen = firstMain ?? firstAuth;
  const canNavigateAfterAuth = Boolean(
    postAuthScreen && postAuthScreen !== 'signin'
  );
  const initialScreen = config.screens.includes('onboarding')
    ? 'onboarding'
    : (firstAuth ?? config.screens[0]);

  const appTitle =
    config.name
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ') || names.projectName;

  return {
    projectName: names.projectName,
    projectSlug: toKebab(names.projectName) || 'my-app',
    appTitle,
    dartPackage: names.dartPackage,
    packageName: config.packageName,
    packagePath: config.packageName.replace(/\./g, '/'),
    packageDomain: packageParts.slice(0, -1).join('.'),
    packageAppName: packageParts[packageParts.length - 1],
    framework: config.framework,
    screens,
    screenIds: config.screens,
    ...screenFlags,

    // Screen group flags
    hasAuthScreens: config.screens.some((s) =>
      AUTH_SCREENS.includes(s as never)
    ),
    hasInfoScreens: config.screens.some((s) =>
      ['faq', 'privacy-policy', 'terms', 'about'].includes(s)
    ),
    hasMainScreens: Boolean(firstMain),
    hasAuthLinks:
      config.screens.includes('signup') ||
      config.screens.includes('forgot-password') ||
      canNavigateAfterAuth,
    hasAccountLinks: config.screens.some((id) =>
      ['change-password', 'privacy-policy', 'terms', 'faq', 'about'].includes(
        id
      )
    ),
    hasProfileLinks:
      config.screens.includes('settings') || config.screens.includes('signin'),

    // Routing helpers
    firstAuthScreen: firstAuth ? screenIdToCases(firstAuth) : null,
    firstMainScreen: firstMain ? screenIdToCases(firstMain) : null,
    initialScreen: initialScreen ? screenIdToCases(initialScreen) : null,
    postAuthScreen: postAuthScreen ? screenIdToCases(postAuthScreen) : null,
    initialPath: initialScreen ? `/${initialScreen}` : '/',
    postAuthPath: postAuthScreen ? `/${postAuthScreen}` : '/',
    onboardingPath: firstAuth
      ? `/${firstAuth}`
      : firstMain
        ? `/${firstMain}`
        : '/',
    onboardingRoute: firstAuth
      ? `/(auth)/${firstAuth}`
      : firstMain
        ? `/(main)/${firstMain}`
        : '/',
    canNavigateAfterAuth,
    postAuthRoute:
      firstMain && config.screens.includes(firstMain)
        ? `/(main)/${firstMain}`
        : firstAuth
          ? `/(auth)/${firstAuth}`
          : '/',
    year: new Date().getFullYear(),
  };
}
