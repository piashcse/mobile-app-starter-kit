import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from '../config.js';
import { getTemplatesDir, copyTemplateDir, screenIdToCases } from '../utils/file.js';
import { logger } from '../utils/logger.js';

export async function generateFlutterProject(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const templatesDir = getTemplatesDir();
  const baseDir = path.join(templatesDir, 'flutter', 'base');
  const screensDir = path.join(templatesDir, 'flutter', 'screens');

  // Step 0: Run flutter create for latest native folders
  logger.step(1, 5, 'Generating native Flutter project...');
  try {
    const { execSync } = await import('child_process');
    
    // Check if flutter is available
    try {
      execSync('flutter --version', { stdio: 'ignore' });
    } catch (e) {
      throw new Error('Flutter SDK not found in PATH');
    }

    const projectName = config.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    // Create project in a temporary sub-directory first to avoid cluttering if it fails
    // or just run it in situ. We'll run it in situ as it's meant to be.
    execSync(`flutter create --org ${config.packageName.split('.').slice(0, -1).join('.')} --project-name ${projectName} --platforms android,ios .`, {
      cwd: config.outputDir,
      stdio: 'ignore', // Keep it quiet
    });
    
    // Clean up default files that we will replace
    await fs.remove(path.join(config.outputDir, 'lib'));
    await fs.remove(path.join(config.outputDir, 'test'));
    await fs.remove(path.join(config.outputDir, 'pubspec.yaml'));
    logger.success('Native folders generated successfully.');
  } catch (error) {
    logger.warn('Flutter native generation failed. Make sure Flutter SDK is installed.');
    logger.info('Falling back to a basic structure...');
    
    // Manual fallback for android/ios folders
    await fs.ensureDir(path.join(config.outputDir, 'android'));
    await fs.ensureDir(path.join(config.outputDir, 'ios'));
    
    // Basic Android structure
    const androidAppDir = path.join(config.outputDir, 'android', 'app');
    await fs.ensureDir(path.join(androidAppDir, 'src', 'main'));
    await fs.writeFile(path.join(androidAppDir, 'build.gradle'), '// Basic Flutter android build.gradle\n');
    
    // Basic iOS structure
    const iosRunnerDir = path.join(config.outputDir, 'ios', 'Runner');
    await fs.ensureDir(iosRunnerDir);
    await fs.writeFile(path.join(iosRunnerDir, 'Info.plist'), '<?xml version="1.0" encoding="UTF-8"?>\n<plist version="1.0"></plist>\n');
    
    logger.success('Basic native structure created as fallback.');
  }

  // Step 1: Copy base template
  logger.step(2, 5, 'Applying base template...');
  await copyTemplateDir(baseDir, config.outputDir, context);

  // Step 2: Copy selected screen features (Clean Architecture)
  logger.step(3, 5, 'Adding selected features...');
  for (const screenId of config.screens) {
    const screenSrcDir = path.join(screensDir, screenId);
    if (await fs.pathExists(screenSrcDir)) {
      const screenDestDir = path.join(
        config.outputDir,
        'lib',
        'features',
        screenId.replace(/-/g, '_')
      );
      await copyTemplateDir(screenSrcDir, screenDestDir, {
        ...context,
        ...screenIdToCases(screenId),
      });
    }
  }

  // Step 3: Generate GoRouter routes
  logger.step(4, 5, 'Generating routes...');
  await generateFlutterRoutes(config, context);

  // Step 4: Generate provider registrations
  logger.step(5, 5, 'Setting up Riverpod providers...');
  await generateFlutterProviders(config, context);
}

async function generateFlutterRoutes(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const routerDir = path.join(config.outputDir, 'lib', 'core', 'router');
  await fs.ensureDir(routerDir);

  const imports: string[] = [];
  const routes: string[] = [];

  for (const screenId of config.screens) {
    const snakeId = screenId.replace(/-/g, '_');
    const cases = screenIdToCases(screenId);
    imports.push(
      `import '../../features/${snakeId}/presentation/${snakeId}_screen.dart';`
    );

    routes.push(`      GoRoute(
        path: '/${screenId}',
        name: '${cases.camel}',
        builder: (context, state) => const ${cases.pascal}Screen(),
      ),`);
  }

  // Improved start destination logic
  let initialLocation = '/signin';
  if (config.screens.includes('onboarding')) {
    initialLocation = '/onboarding';
  } else if (config.screens.includes('signin')) {
    initialLocation = '/signin';
  } else if (config.screens.length > 0) {
    initialLocation = `/${config.screens[0]}`;
  }

  const routerContent = `import 'package:go_router/go_router.dart';
${imports.join('\n')}

final appRouter = GoRouter(
  initialLocation: '${initialLocation}',
  routes: [
${routes.join('\n')}
  ],
);
`;

  await fs.writeFile(path.join(routerDir, 'app_router.dart'), routerContent);
}

async function generateFlutterProviders(
  config: ProjectConfig,
  _context: Record<string, unknown>
): Promise<void> {
  // Providers are already inside each feature folder with Clean Architecture
  // This generates the central providers barrel file if needed
  const diDir = path.join(config.outputDir, 'lib', 'core', 'di');
  await fs.ensureDir(diDir);

  const exports: string[] = [];
  for (const screenId of config.screens) {
    const snakeId = screenId.replace(/-/g, '_');
    exports.push(`export '../../features/${snakeId}/presentation/${snakeId}_controller.dart';`);
  }

  const barrelContent = `// Barrel file for all feature controllers/providers
${exports.join('\n')}
`;

  await fs.writeFile(path.join(diDir, 'providers.dart'), barrelContent);
}
