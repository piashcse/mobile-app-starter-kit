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

  // Step 1: Copy base template
  logger.step(1, 4, 'Copying base Flutter project...');
  await copyTemplateDir(baseDir, config.outputDir, context);

  // Step 2: Copy selected screen features (Clean Architecture)
  logger.step(2, 4, 'Adding selected features...');
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
  logger.step(3, 4, 'Generating routes...');
  await generateFlutterRoutes(config, context);

  // Step 4: Generate provider registrations
  logger.step(4, 4, 'Setting up Riverpod providers...');
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

  const authScreens = ['signin', 'signup', 'forgot-password'];

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

  const routerContent = `import 'package:go_router/go_router.dart';
${imports.join('\n')}

final appRouter = GoRouter(
  initialLocation: '/signin',
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
