import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import { spawnSync } from 'child_process';
import {
  DEFAULT_SCREENS,
  FRAMEWORKS,
  SCREENS,
  type Framework,
  type ProjectConfig,
} from '../config.js';
import { logger, fail } from '../utils/logger.js';
import {
  parseScreenList,
  validateFramework,
  validatePackageName,
  validateProjectName,
  validateScreens,
} from '../utils/validator.js';
import { deriveProjectNames } from '../utils/file.js';
import { generateProject } from '../generator.js';

export interface InitOptions {
  name?: string;
  framework?: string;
  screens?: string;
  skip?: string;
  packageName?: string;
  output?: string;
  yes?: boolean;
  force?: boolean;
  install?: boolean;
  git?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  logger.title('📱 Mobile App Starter Kit');

  const interactive = Boolean(
    process.stdin.isTTY && process.stdout.isTTY && !options.yes
  );

  let config: ProjectConfig;
  let install = options.install ?? true;
  let initGit = options.git ?? true;

  try {
    config = interactive
      ? await promptUser(options)
      : resolveNonInteractive(options);
  } catch (error) {
    fail((error as Error).message);
  }

  // Resolve dependency install / git preferences interactively.
  if (interactive) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'install',
        message:
          config.framework === 'kmp'
            ? 'Generate a Gradle wrapper and validate project files?'
            : 'Install dependencies now?',
        default: options.install ?? true,
        when: options.install === undefined,
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: options.git ?? true,
        when: options.git === undefined,
      },
    ]);
    if (options.install === undefined) install = answers.install;
    if (options.git === undefined) initGit = answers.git;
  }

  printSummary(config);

  if (options.dryRun) {
    logger.info('Dry run — no files were written.');
    logger.blank();
    return;
  }

  if (interactive) {
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Generate this project?',
        default: true,
      },
    ]);
    if (!proceed) {
      logger.info('Cancelled.');
      return;
    }
  }

  // Guard against clobbering an existing project.
  if (await fs.pathExists(config.outputDir)) {
    const files = await fs.readdir(config.outputDir);
    if (files.length > 0) {
      if (!options.force) {
        fail(
          `Output directory "${config.outputDir}" is not empty.\n` +
            'Choose a different directory with --output, or re-run with --force to replace it.'
        );
      }
      logger.warn(`Replacing existing directory ${config.outputDir}`);
      await fs.remove(config.outputDir);
    }
  }

  logger.startSpinner('Generating project...');

  try {
    await generateProject(config);
    logger.stopSpinner(true, 'Project files generated');

    if (install) {
      await installDependencies(config, options.verbose);
    }

    if (initGit) {
      initGitRepository(config, options.verbose);
    }

    printNextSteps(config, install);
  } catch (error) {
    logger.stopSpinner(false, 'Failed to generate project');
    logger.error((error as Error).message);
    process.exitCode = 1;
  }
}

function resolveNonInteractive(options: InitOptions): ProjectConfig {
  if (!options.name) {
    fail(
      'Missing required option --name.\n' +
        'Example: mobile-app-starter-kit init --name MyApp --framework expo --yes'
    );
  }
  if (!options.framework) {
    fail(
      'Missing required option --framework.\n' +
        `Available: ${FRAMEWORKS.map((f) => f.id).join(', ')}`
    );
  }
  return resolveConfig(options);
}

function resolveConfig(options: InitOptions): ProjectConfig {
  const name = options.name!.trim();
  if (!validateProjectName(name)) {
    fail(
      'Invalid project name. Use letters, numbers, spaces, hyphens, or underscores (max 50 characters).'
    );
  }

  const framework = options.framework as Framework;
  if (!validateFramework(framework)) {
    fail(
      `Invalid framework: ${options.framework}. Use: ${FRAMEWORKS.map(
        (f) => f.id
      ).join(', ')}.`
    );
  }

  let screens = options.screens
    ? parseScreenList(options.screens)
    : [...DEFAULT_SCREENS];

  const skipList = parseScreenList(options.skip);
  if (skipList.length > 0) {
    screens = screens.filter((screen) => !skipList.includes(screen));
  }

  const { valid, invalid } = validateScreens(screens);
  if (invalid.length > 0) {
    logger.warn(`Unknown screens ignored: ${invalid.join(', ')}`);
  }
  if (valid.length === 0) {
    fail(
      'No screens selected. Use --screens with at least one of:\n  ' +
        SCREENS.map((s) => s.id).join(', ')
    );
  }

  const packageName =
    options.packageName || deriveProjectNames(name).packageName;
  if (!validatePackageName(packageName)) {
    fail(
      `Invalid package name: "${packageName}". Use a reverse-domain identifier like com.example.myapp (Java/Kotlin keywords such as "final" are not allowed).`
    );
  }

  const outputDir = options.output
    ? path.resolve(options.output)
    : path.resolve(process.cwd(), deriveProjectNames(name).dirName);

  return { name, framework, screens: valid, packageName, outputDir };
}

async function promptUser(options: InitOptions): Promise<ProjectConfig> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: options.name || 'MyApp',
      validate: (input: string) =>
        validateProjectName(input) ||
        'Use letters, numbers, spaces, hyphens, or underscores.',
      when: !options.name || !validateProjectName(options.name),
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Framework:',
      choices: FRAMEWORKS.map((f) => ({
        name: `${f.name} — ${f.description}`,
        value: f.id,
      })),
      when: !options.framework || !validateFramework(options.framework),
    },
    {
      type: 'checkbox',
      name: 'screens',
      message: 'Screens to include:',
      choices: SCREENS.map((s) => ({
        name: `${s.name} — ${s.description}`,
        value: s.id,
        checked: s.defaultIncluded,
      })),
      validate: (input: readonly string[]) =>
        input.length > 0 || 'Select at least one screen.',
      when: !options.screens,
    },
    {
      type: 'input',
      name: 'packageName',
      message: 'Package/bundle identifier:',
      default: (current: Record<string, unknown>) => {
        const name =
          options.name || (current.name as string | undefined) || 'MyApp';
        return deriveProjectNames(name).packageName;
      },
      validate: (input: string) =>
        validatePackageName(input) || 'Must be like com.example.myapp',
      when: !options.packageName || !validatePackageName(options.packageName),
    },
  ]);

  const name = (
    options.name && validateProjectName(options.name)
      ? options.name
      : answers.name
  ).trim();
  const framework = (
    options.framework && validateFramework(options.framework)
      ? options.framework
      : answers.framework
  ) as Framework;
  const packageName =
    options.packageName && validatePackageName(options.packageName)
      ? options.packageName
      : answers.packageName;

  const merged: InitOptions = {
    ...options,
    name,
    framework,
    packageName,
    screens: options.screens || (answers.screens as string[]).join(','),
  };

  return resolveConfig(merged);
}

function printSummary(config: ProjectConfig): void {
  const frameworkName =
    FRAMEWORKS.find((f) => f.id === config.framework)?.name ?? config.framework;

  logger.blank();
  logger.info(`Project:   ${config.name}`);
  logger.info(`Framework: ${frameworkName}`);
  logger.info(`Screens:   ${config.screens.join(', ')}`);
  logger.info(`Package:   ${config.packageName}`);
  logger.info(`Output:    ${config.outputDir}`);
  logger.blank();
}

async function installDependencies(
  config: ProjectConfig,
  verbose?: boolean
): Promise<void> {
  const commands: Record<Framework, { cmd: string; args: string[] } | null> = {
    expo: { cmd: 'npm', args: ['install', '--no-audit', '--no-fund'] },
    flutter: { cmd: 'flutter', args: ['pub', 'get'] },
    // KMP downloads a Gradle distribution on first run; leave that to the user.
    kmp: null,
  };

  const command = commands[config.framework];
  if (!command) return;

  logger.updateSpinner(
    `Installing dependencies (${command.cmd} ${command.args.join(' ')})...`
  );
  const result = run(command.cmd, command.args, config.outputDir, verbose);

  if (result.status !== 0) {
    logger.warn('Dependency installation failed. Run it manually:');
    logger.blank();
    logger.info(`  cd "${config.outputDir}"`);
    logger.info(`  ${command.cmd} ${command.args.join(' ')}`);
    logger.blank();
    return;
  }

  // Expo native projects can only be generated after dependencies exist.
  if (config.framework === 'expo') {
    logger.updateSpinner('Generating native android and ios projects...');
    const prebuild = run(
      'npx',
      ['expo', 'prebuild', '--no-install', '--platform', 'all'],
      config.outputDir,
      verbose
    );
    if (prebuild.status !== 0) {
      logger.warn(
        'Native projects were not generated. Run "npx expo prebuild" after fixing the error above.'
      );
    }
  }
}

function initGitRepository(config: ProjectConfig, verbose?: boolean): void {
  const result = run('git', ['init', '-q'], config.outputDir, verbose);
  if (result.status !== 0) {
    logger.warn('Could not initialize a git repository (is git installed?).');
  }
}

function run(cmd: string, args: string[], cwd: string, verbose?: boolean) {
  return spawnSync(cmd, args, {
    cwd,
    stdio: verbose ? 'inherit' : 'pipe',
    encoding: 'utf-8',
  });
}

function printNextSteps(config: ProjectConfig, installed: boolean): void {
  logger.blank();
  logger.success('🎉 Your project is ready!');
  logger.blank();

  const relativeDir = path.relative(process.cwd(), config.outputDir);
  const cdTarget =
    relativeDir && !relativeDir.startsWith('..')
      ? relativeDir
      : config.outputDir;
  console.log('  Next steps:\n');
  console.log(`  cd "${cdTarget}"`);

  if (config.framework === 'expo') {
    if (!installed) console.log('  npm install');
    if (!installed)
      console.log(
        '  npx expo prebuild   # optional: generate android/ and ios/'
      );
    console.log('  npx expo start');
  } else if (config.framework === 'flutter') {
    if (!installed) console.log('  flutter pub get');
    console.log('  flutter run');
  } else {
    console.log('  ./gradlew :androidApp:assembleDebug   # Android');
    console.log(
      '  # iOS: cd iosApp && xcodegen generate && open iosApp.xcodeproj'
    );
    console.log('  # Or open the project in Android Studio / IntelliJ IDEA');
  }

  logger.blank();
  console.log('  Demo credentials: test@example.com / password');
  logger.blank();

  if (config.framework === 'kmp') {
    logger.info(
      'KMP note: the first Gradle build downloads the Gradle distribution and dependencies.'
    );
  }
  logger.info(
    'Docs: https://github.com/piashcse/mobile-app-starter-kit#readme'
  );
  logger.blank();
}
