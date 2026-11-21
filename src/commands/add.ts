import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import type { Framework, ProjectConfig } from '../config.js';
import { FRAMEWORKS, SCREENS } from '../config.js';
import { logger, fail } from '../utils/logger.js';
import {
  parseScreenList,
  validateFramework,
  validateScreens,
} from '../utils/validator.js';
import { generateProject } from '../generator.js';

interface AddOptions {
  screen?: string;
  framework?: string;
  output?: string;
  yes?: boolean;
}

interface DetectedProject {
  framework: Framework;
  name: string;
  packageName: string;
  outputDir: string;
  screens: string[];
}

export async function addCommand(options: AddOptions): Promise<void> {
  logger.title('➕ Add Screen');

  const projectDir = path.resolve(options.output ?? process.cwd());
  const project = await detectProject(projectDir, options.framework);

  if (!project) {
    fail(
      `Could not detect a generated project in "${projectDir}".\n` +
        'Run this command inside a project created by mobile-app-starter-kit, or pass --framework and --output.'
    );
    return;
  }

  const existing = new Set(project.screens);
  const available = SCREENS.filter((s) => !existing.has(s.id));

  if (available.length === 0) {
    logger.success('All available screens are already part of this project.');
    return;
  }

  let requested = parseScreenList(options.screen);

  if (requested.length === 0) {
    if (!process.stdin.isTTY || options.yes) {
      fail(
        'Missing --screen. Available screens: ' +
          available.map((s) => s.id).join(', ')
      );
    }
    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'screens',
        message: 'Screens to add:',
        choices: available.map((s) => ({
          name: `${s.name} — ${s.description}`,
          value: s.id,
        })),
        validate: (input: readonly string[]) =>
          input.length > 0 || 'Select at least one screen.',
      },
    ]);
    requested = answers.screens as string[];
  }

  const { valid, invalid } = validateScreens(requested);
  if (invalid.length > 0) {
    logger.warn(`Unknown screens ignored: ${invalid.join(', ')}`);
  }
  if (valid.length === 0) {
    fail(
      `No valid screens selected. Available: ${available
        .map((screen) => screen.id)
        .join(', ')}`
    );
  }

  const toAdd = valid.filter((id) => !existing.has(id));
  if (toAdd.length === 0) {
    logger.warn('None of the requested screens are new. Nothing to do.');
    return;
  }

  logger.info(`Project:   ${project.name}`);
  logger.info(`Framework: ${project.framework}`);
  logger.info(`Adding:    ${toAdd.join(', ')}`);
  logger.blank();

  if (!options.yes && process.stdin.isTTY) {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Add these screens to the existing project?',
        default: true,
      },
    ]);
    if (!confirmed) {
      logger.info('Cancelled.');
      return;
    }
  }

  const allScreens = dedupe([...project.screens, ...toAdd]);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mask-add-'));
  const config: ProjectConfig = {
    name: project.name,
    framework: project.framework,
    screens: allScreens,
    packageName: project.packageName,
    outputDir: tempDir,
  };

  logger.startSpinner('Generating updated screens...');
  try {
    await generateProject(config);
    await copyUpdatedFiles(project, toAdd, tempDir);
    logger.stopSpinner(true, `Added: ${toAdd.join(', ')}`);
    logger.blank();
    logger.success('Screen(s) added successfully.');
    logger.info(
      'Review the changes and wire any new navigation links you need.'
    );
  } catch (error) {
    logger.stopSpinner(false, 'Failed to add screens');
    logger.error((error as Error).message);
    process.exitCode = 1;
  } finally {
    await fs.remove(tempDir).catch(() => undefined);
  }
}

async function detectProject(
  dir: string,
  frameworkFlag?: string
): Promise<DetectedProject | null> {
  let framework: Framework | null = null;

  if (frameworkFlag) {
    if (!validateFramework(frameworkFlag)) {
      fail(
        `Invalid framework "${frameworkFlag}". Use: ${FRAMEWORKS.map((f) => f.id).join(', ')}.`
      );
    }
    framework = frameworkFlag;
  } else if (await fs.pathExists(path.join(dir, 'app.json'))) {
    framework = 'expo';
  } else if (await fs.pathExists(path.join(dir, 'pubspec.yaml'))) {
    framework = 'flutter';
  } else if (await fs.pathExists(path.join(dir, 'settings.gradle.kts'))) {
    framework = 'kmp';
  }

  if (!framework) return null;

  const screens = await detectScreens(dir, framework);
  if (screens.length === 0) return null;

  switch (framework) {
    case 'expo':
      return detectExpo(dir, screens);
    case 'flutter':
      return detectFlutter(dir, screens);
    case 'kmp':
      return detectKmp(dir, screens);
  }
}

async function detectExpo(
  dir: string,
  screens: string[]
): Promise<DetectedProject> {
  const appJson = await fs
    .readJson(path.join(dir, 'app.json'))
    .catch(() => ({}));
  const pkg = await fs
    .readJson(path.join(dir, 'package.json'))
    .catch(() => ({}));
  return {
    framework: 'expo',
    name: appJson?.expo?.name ?? pkg?.name ?? path.basename(dir),
    packageName:
      appJson?.expo?.android?.package ??
      appJson?.expo?.ios?.bundleIdentifier ??
      'com.example.app',
    outputDir: dir,
    screens,
  };
}

async function detectFlutter(
  dir: string,
  screens: string[]
): Promise<DetectedProject> {
  const pubspec = await fs.readFile(path.join(dir, 'pubspec.yaml'), 'utf-8');
  const name =
    /^name:\s*(.+)$/m.exec(pubspec)?.[1]?.trim() ?? path.basename(dir);

  let packageName = `com.example.${name.replace(/_/g, '')}`;
  const gradlePath = path.join(dir, 'android', 'app', 'build.gradle.kts');
  if (await fs.pathExists(gradlePath)) {
    const gradle = await fs.readFile(gradlePath, 'utf-8');
    packageName =
      /namespace\s*=\s*"([^"]+)"/.exec(gradle)?.[1] ??
      /applicationId\s*=\s*"([^"]+)"/.exec(gradle)?.[1] ??
      packageName;
  }

  return {
    framework: 'flutter',
    name: name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    packageName,
    outputDir: dir,
    screens,
  };
}

async function detectKmp(
  dir: string,
  screens: string[]
): Promise<DetectedProject> {
  const settings = await fs.readFile(
    path.join(dir, 'settings.gradle.kts'),
    'utf-8'
  );
  const name =
    /rootProject\.name\s*=\s*"([^"]+)"/.exec(settings)?.[1] ??
    path.basename(dir);

  let packageName = `com.example.${name.replace(/[^a-z0-9]/gi, '').toLowerCase()}`;
  const gradlePath = path.join(dir, 'androidApp', 'build.gradle.kts');
  if (await fs.pathExists(gradlePath)) {
    const gradle = await fs.readFile(gradlePath, 'utf-8');
    packageName = /namespace\s*=\s*"([^"]+)"/.exec(gradle)?.[1] ?? packageName;
  }

  return {
    framework: 'kmp',
    name,
    packageName,
    outputDir: dir,
    screens,
  };
}

async function detectScreens(
  dir: string,
  framework: Framework
): Promise<string[]> {
  const featuresDir =
    framework === 'expo'
      ? path.join(dir, 'src', 'features')
      : framework === 'flutter'
        ? path.join(dir, 'lib', 'features')
        : path.join(
            dir,
            'composeApp',
            'src',
            'commonMain',
            'kotlin',
            'features'
          );

  if (!(await fs.pathExists(featuresDir))) return [];

  const entries = await fs.readdir(featuresDir, { withFileTypes: true });
  const dirNames = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  return SCREENS.filter((screen) => {
    const normalized =
      framework === 'expo'
        ? screen.id
        : framework === 'flutter'
          ? screen.id.replace(/-/g, '_')
          : screen.id.replace(/-/g, '');
    return dirNames.includes(normalized);
  }).map((s) => s.id);
}

async function copyUpdatedFiles(
  project: DetectedProject,
  added: string[],
  tempDir: string
): Promise<void> {
  if (project.framework === 'expo') {
    await copyIfMissing(
      path.join(tempDir, 'design-tokens.json'),
      path.join(project.outputDir, 'design-tokens.json')
    );
    await copyIfMissing(
      path.join(tempDir, 'src', 'i18n'),
      path.join(project.outputDir, 'src', 'i18n')
    );
    await copyIfMissing(
      path.join(tempDir, 'src', 'theme'),
      path.join(project.outputDir, 'src', 'theme')
    );
    for (const id of added) {
      await copyIfExists(
        path.join(tempDir, 'src', 'features', id),
        path.join(project.outputDir, 'src', 'features', id)
      );
    }
    await copyIfExists(
      path.join(tempDir, 'app'),
      path.join(project.outputDir, 'app')
    );
    await copyIfExists(
      path.join(tempDir, 'src', 'api', 'apiSlice.ts'),
      path.join(project.outputDir, 'src', 'api', 'apiSlice.ts')
    );
    return;
  }

  if (project.framework === 'flutter') {
    await copyIfMissing(
      path.join(tempDir, 'design-tokens.json'),
      path.join(project.outputDir, 'design-tokens.json')
    );
    for (const relative of [
      ['lib', 'core', 'l10n'],
      ['lib', 'core', 'theme', 'design_tokens.dart'],
      ['lib', 'core', 'theme', 'app_colors.dart'],
    ]) {
      await copyIfMissing(
        path.join(tempDir, ...relative),
        path.join(project.outputDir, ...relative)
      );
    }
    for (const id of added) {
      const snake = id.replace(/-/g, '_');
      await copyIfExists(
        path.join(tempDir, 'lib', 'features', snake),
        path.join(project.outputDir, 'lib', 'features', snake)
      );
    }
    for (const relative of [
      ['lib', 'core', 'router', 'app_router.dart'],
      ['lib', 'core', 'di', 'providers.dart'],
    ]) {
      await copyIfExists(
        path.join(tempDir, ...relative),
        path.join(project.outputDir, ...relative)
      );
    }
    return;
  }

  // KMP
  await copyIfMissing(
    path.join(tempDir, 'design-tokens.json'),
    path.join(project.outputDir, 'design-tokens.json')
  );
  await copyIfMissing(
    path.join(
      tempDir,
      'composeApp',
      'src',
      'commonMain',
      'kotlin',
      'core',
      'i18n'
    ),
    path.join(
      project.outputDir,
      'composeApp',
      'src',
      'commonMain',
      'kotlin',
      'core',
      'i18n'
    )
  );
  for (const relative of [
    [
      'composeApp',
      'src',
      'commonMain',
      'kotlin',
      'core',
      'theme',
      'AppColors.kt',
    ],
    [
      'composeApp',
      'src',
      'commonMain',
      'kotlin',
      'core',
      'theme',
      'DesignTokens.kt',
    ],
  ]) {
    await copyIfMissing(
      path.join(tempDir, ...relative),
      path.join(project.outputDir, ...relative)
    );
  }
  for (const id of added) {
    const compact = id.replace(/-/g, '');
    await copyIfExists(
      path.join(
        tempDir,
        'composeApp',
        'src',
        'commonMain',
        'kotlin',
        'features',
        compact
      ),
      path.join(
        project.outputDir,
        'composeApp',
        'src',
        'commonMain',
        'kotlin',
        'features',
        compact
      )
    );
  }
  for (const relative of [
    [
      'composeApp',
      'src',
      'commonMain',
      'kotlin',
      'navigation',
      'AppNavigation.kt',
    ],
    ['composeApp', 'src', 'commonMain', 'kotlin', 'di', 'ViewModelProvider.kt'],
  ]) {
    await copyIfExists(
      path.join(tempDir, ...relative),
      path.join(project.outputDir, ...relative)
    );
  }
}

async function copyIfExists(src: string, dest: string): Promise<void> {
  if (await fs.pathExists(src)) {
    await fs.copy(src, dest, { overwrite: true });
  }
}

async function copyIfMissing(src: string, dest: string): Promise<void> {
  if ((await fs.pathExists(src)) && !(await fs.pathExists(dest))) {
    await fs.copy(src, dest);
  }
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}
