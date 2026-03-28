import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { addCommand } from './commands/add.js';

export function createCli(): Command {
  const program = new Command();

  program
    .name('mobile-app-starter-kit')
    .description(
      'Generate production-ready mobile app boilerplate for Expo React Native, Flutter, and KMP'
    )
    .version('1.0.0');

  program
    .command('init')
    .description('Initialize a new mobile app project')
    .option('-n, --name <name>', 'Project name')
    .option(
      '-f, --framework <framework>',
      'Framework to use (expo, flutter, kmp)'
    )
    .option(
      '-s, --screens <screens>',
      'Comma-separated list of screens to include'
    )
    .option(
      '--skip <screens>',
      'Comma-separated list of screens to skip'
    )
    .option(
      '-p, --package-name <packageName>',
      'Package/bundle identifier (e.g., com.example.myapp)'
    )
    .option(
      '-o, --output <path>',
      'Output directory (defaults to ./<project-name>)'
    )
    .action(initCommand);

  program
    .command('list <type>')
    .description('List available screens or frameworks')
    .action(listCommand);

  program
    .command('add')
    .description('Add a screen to an existing project')
    .option(
      '-s, --screen <screen>',
      'Screen to add'
    )
    .option(
      '-f, --framework <framework>',
      'Framework of the existing project'
    )
    .action(addCommand);

  return program;
}
