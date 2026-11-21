import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { initCommand, type InitOptions } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { addCommand } from './commands/add.js';
import { doctorCommand } from './commands/doctor.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function readPackageVersion(): string {
  try {
    const packagePath = path.resolve(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8')) as {
      version?: string;
    };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export function createCli(): Command {
  const program = new Command();

  program
    .name('mobile-app-starter-kit')
    .description(
      'Generate production-ready mobile app boilerplate for Expo React Native, Flutter, and KMP'
    )
    .version(readPackageVersion())
    .showSuggestionAfterError();

  program
    .command('init')
    .alias('create')
    .description('Initialize a new mobile app project')
    .option('-n, --name <name>', 'Project name (any format)')
    .option(
      '-f, --framework <framework>',
      'Framework to use (expo, flutter, kmp)'
    )
    .option('-s, --screens <screens>', 'Comma-separated screens to include')
    .option('--skip <screens>', 'Comma-separated screens to skip')
    .option(
      '-p, --package-name <packageName>',
      'Package/bundle identifier (e.g., com.example.myapp)'
    )
    .option(
      '-o, --output <path>',
      'Output directory (defaults to ./<project-name>)'
    )
    .option('-y, --yes', 'Skip prompts and use defaults')
    .option('--force', 'Replace the output directory if it is not empty')
    .option('--no-install', 'Do not install dependencies after generating')
    .option('--no-git', 'Do not initialize a git repository')
    .option(
      '--dry-run',
      'Print the resolved configuration without writing files'
    )
    .option('--verbose', 'Stream dependency installation output')
    .addHelpText(
      'after',
      `
Examples:
  $ mobile-app-starter-kit init
  $ mobile-app-starter-kit init --name "My App" --framework expo --yes
  $ mobile-app-starter-kit init -n MyApp -f flutter -s signin,profile -p com.acme.myapp
  $ mobile-app-starter-kit init -n MyApp -f kmp --skip onboarding,terms --no-install
`
    )
    .action((options: InitOptions, command: Command) => {
      // Commander defaults negated flags to true. Recover "not supplied" so
      // interactive runs can still ask about install and git setup.
      const install =
        command.getOptionValueSource('install') === 'cli'
          ? options.install
          : undefined;
      const git =
        command.getOptionValueSource('git') === 'cli' ? options.git : undefined;
      return initCommand({ ...options, install, git });
    });

  program
    .command('add')
    .description('Add a screen to an existing generated project')
    .option('-s, --screen <screen>', 'Screen to add (comma-separated)')
    .option(
      '-f, --framework <framework>',
      'Framework (auto-detected when omitted)'
    )
    .option('-o, --output <path>', 'Project directory (defaults to cwd)')
    .option('-y, --yes', 'Skip confirmation prompts')
    .action(addCommand);

  program
    .command('list')
    .argument('[type]', 'What to list: screens or frameworks')
    .description('List available screens or frameworks')
    .option('--json', 'Output machine-readable JSON')
    .action(listCommand);

  program
    .command('doctor')
    .description('Check that your environment has the required toolchains')
    .action(doctorCommand);

  return program;
}
