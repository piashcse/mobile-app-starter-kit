import chalk from 'chalk';
import { FRAMEWORKS, SCREENS } from '../config.js';
import { logger } from '../utils/logger.js';

interface ListOptions {
  json?: boolean;
}

export function listCommand(
  type: string | undefined,
  options: ListOptions = {}
): void {
  if (!type) {
    logger.error('Missing list type. Use "screens" or "frameworks".');
    process.exitCode = 1;
    return;
  }

  if (type === 'screens') {
    if (options.json) {
      console.log(JSON.stringify(SCREENS, null, 2));
      return;
    }

    logger.title('📋 Available Screens');
    const categories = [
      'auth',
      'user',
      'onboarding',
      'info',
      'feature',
    ] as const;

    for (const category of categories) {
      const categoryScreens = SCREENS.filter((s) => s.category === category);
      if (categoryScreens.length === 0) continue;
      console.log(chalk.bold.yellow(`\n  ${category.toUpperCase()}`));
      for (const screen of categoryScreens) {
        const defaultTag = screen.defaultIncluded
          ? chalk.green(' (default)')
          : chalk.gray(' (opt-in)');
        console.log(
          `    ${chalk.white(screen.id.padEnd(20))} ${chalk.gray(
            screen.description
          )}${defaultTag}`
        );
      }
    }
    logger.blank();
    return;
  }

  if (type === 'frameworks') {
    if (options.json) {
      console.log(JSON.stringify(FRAMEWORKS, null, 2));
      return;
    }

    logger.title('🛠️  Available Frameworks');
    for (const fw of FRAMEWORKS) {
      console.log(
        `  ${chalk.bold.white(fw.id.padEnd(12))} ${chalk.cyan(fw.name)}`
      );
      console.log(`  ${''.padEnd(12)} ${chalk.gray(fw.description)}\n`);
    }
    return;
  }

  logger.error(`Unknown list type: ${type}. Use "screens" or "frameworks".`);
  process.exitCode = 1;
}
