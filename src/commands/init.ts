import inquirer from 'inquirer';
import path from 'path';
import ora from 'ora';
import { FRAMEWORKS, SCREENS, DEFAULT_SCREENS, type Framework, type ProjectConfig } from '../config.js';
import { logger } from '../utils/logger.js';
import {
  validateFramework,
  validateScreens,
  validatePackageName,
  validateProjectName,
} from '../utils/validator.js';
import { toPackageName } from '../utils/file.js';
import { generateProject } from '../generator.js';

interface InitOptions {
  name?: string;
  framework?: string;
  screens?: string;
  skip?: string;
  packageName?: string;
  output?: string;
}

export async function initCommand(options: InitOptions): Promise<void> {
  logger.title('📱 Mobile App Starter Kit');

  let config: ProjectConfig;

  const hasAllFlags = options.name && options.framework && (options.screens || options.skip);

  if (hasAllFlags) {
    // Non-interactive mode
    config = resolveFromFlags(options);
  } else {
    // Interactive mode
    config = await promptUser(options);
  }

  logger.blank();
  logger.info(`Project: ${config.name}`);
  logger.info(
    `Framework: ${FRAMEWORKS.find((f) => f.id === config.framework)?.name}`
  );
  logger.info(`Screens: ${config.screens.join(', ')}`);
  logger.info(`Package: ${config.packageName}`);
  logger.info(`Output: ${config.outputDir}`);
  logger.blank();

  const spinner = ora('Generating project...').start();

  try {
    await generateProject(config);
    spinner.succeed('Project generated successfully!');
    logger.blank();
    printNextSteps(config);
  } catch (error) {
    spinner.fail('Failed to generate project');
    logger.error((error as Error).message);
    process.exit(1);
  }
}

function resolveFromFlags(options: InitOptions): ProjectConfig {
  const name = options.name!;
  if (!validateProjectName(name)) {
    logger.error('Invalid project name. Use alphanumeric characters, spaces, hyphens, or underscores.');
    process.exit(1);
  }

  const framework = options.framework as Framework;
  if (!validateFramework(framework)) {
    logger.error(`Invalid framework: ${framework}. Use: expo, flutter, or kmp`);
    process.exit(1);
  }

  let screens: string[];
  if (options.screens) {
    screens = options.screens.split(',').map((s) => s.trim());
  } else {
    screens = [...DEFAULT_SCREENS];
  }

  if (options.skip) {
    const skipList = options.skip.split(',').map((s) => s.trim());
    screens = screens.filter((s) => !skipList.includes(s));
  }

  const { valid, invalid } = validateScreens(screens);
  if (invalid.length > 0) {
    logger.warn(`Unknown screens ignored: ${invalid.join(', ')}`);
  }
  screens = valid;

  const packageName =
    options.packageName || `com.example.${toPackageName(name).replace(/-/g, '')}`;
  if (!validatePackageName(packageName)) {
    logger.error(`Invalid package name: ${packageName}`);
    process.exit(1);
  }

  const outputDir = options.output
    ? path.resolve(options.output)
    : path.resolve(process.cwd(), toPackageName(name));

  return { name, framework, screens, packageName, outputDir };
}

async function promptUser(options: InitOptions): Promise<ProjectConfig> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
      default: options.name || 'MyApp',
      validate: (input: string) =>
        validateProjectName(input) || 'Use alphanumeric characters, spaces, hyphens, or underscores.',
      when: !options.name,
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Select a framework:',
      choices: FRAMEWORKS.map((f) => ({
        name: `${f.name} — ${f.description}`,
        value: f.id,
      })),
      when: !options.framework || !validateFramework(options.framework),
    },
    {
      type: 'checkbox',
      name: 'screens',
      message: 'Select screens to include:',
      choices: SCREENS.map((s) => ({
        name: `${s.name} — ${s.description}`,
        value: s.id,
        checked: s.defaultIncluded,
      })),
      when: !options.screens,
    },
    {
      type: 'input',
      name: 'packageName',
      message: 'Enter package/bundle identifier:',
      default: (prev: Record<string, string>) => {
        const name = options.name || prev.name || 'MyApp';
        return `com.example.${toPackageName(name).replace(/-/g, '')}`;
      },
      validate: (input: string) =>
        validatePackageName(input) || 'Must be like com.example.myapp',
      when: !options.packageName,
    },
  ]);

  const name = options.name || answers.name;
  const framework = (options.framework as Framework) || answers.framework;
  let screens: string[] = options.screens
    ? options.screens.split(',').map((s) => s.trim())
    : answers.screens;

  if (options.skip) {
    const skipList = options.skip.split(',').map((s) => s.trim());
    screens = screens.filter((s: string) => !skipList.includes(s));
  }

  const packageName = options.packageName || answers.packageName;
  const outputDir = options.output
    ? path.resolve(options.output)
    : path.resolve(process.cwd(), toPackageName(name));

  return { name, framework, screens, packageName, outputDir };
}

function printNextSteps(config: ProjectConfig): void {
  logger.success('🎉 Your project is ready!\n');

  const fw = config.framework;

  console.log('  Next steps:\n');
  console.log(`  cd ${path.basename(config.outputDir)}`);

  if (fw === 'expo') {
    console.log('  npm install');
    console.log('  npx expo start');
  } else if (fw === 'flutter') {
    console.log('  flutter pub get');
    console.log('  flutter run');
  } else if (fw === 'kmp') {
    console.log('  ./gradlew build');
    console.log('  # Open in Android Studio or IntelliJ IDEA');
  }

  logger.blank();
}
