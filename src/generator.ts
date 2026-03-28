import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from './config.js';
import { getTemplatesDir, copyTemplateDir, copyTemplateFile, screenIdToCases } from './utils/file.js';
import { logger } from './utils/logger.js';
import { generateExpoProject } from './frameworks/expo.js';
import { generateFlutterProject } from './frameworks/flutter.js';
import { generateKmpProject } from './frameworks/kmp.js';

export async function generateProject(config: ProjectConfig): Promise<void> {
  // Ensure output directory exists and is empty
  if (await fs.pathExists(config.outputDir)) {
    const files = await fs.readdir(config.outputDir);
    if (files.length > 0) {
      throw new Error(
        `Output directory "${config.outputDir}" is not empty. Please choose a different directory.`
      );
    }
  }

  await fs.ensureDir(config.outputDir);

  // Build template context
  const context = buildContext(config);

  // Delegate to framework-specific generator
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
}

function buildContext(config: ProjectConfig): Record<string, unknown> {
  const screenConfigs = config.screens.map((id) => ({
    ...screenIdToCases(id),
    id,
    hasScreen: true,
  }));

  // Create boolean flags for each screen (hasSignin, hasSignup, etc.)
  const screenFlags: Record<string, boolean> = {};
  const allScreenIds = [
    'signin', 'signup', 'forgot-password', 'change-password',
    'profile', 'settings', 'onboarding', 'faq',
    'privacy-policy', 'terms', 'notifications', 'about',
  ];

  for (const id of allScreenIds) {
    const cases = screenIdToCases(id);
    screenFlags[`has${cases.pascal}`] = config.screens.includes(id);
  }

  // Package name parts
  const packageParts = config.packageName.split('.');

  return {
    projectName: config.name,
    packageName: config.packageName,
    packagePath: config.packageName.replace(/\./g, '/'),
    packageDomain: packageParts.slice(0, -1).join('.'),
    packageAppName: packageParts[packageParts.length - 1],
    framework: config.framework,
    screens: screenConfigs,
    screenIds: config.screens,
    ...screenFlags,

    // Auth screens group
    hasAuthScreens: config.screens.some((s) =>
      ['signin', 'signup', 'forgot-password', 'change-password'].includes(s)
    ),
    // Info screens group
    hasInfoScreens: config.screens.some((s) =>
      ['faq', 'privacy-policy', 'terms', 'about'].includes(s)
    ),
  };
}
