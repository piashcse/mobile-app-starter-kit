import fs from 'fs';
import { spawnSync } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import { logger } from '../utils/logger.js';

interface ToolCheck {
  name: string;
  command: string;
  args: string[];
  required: boolean;
  hint: string;
}

const ANDROID_HOME = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;

const TOOLS: ToolCheck[] = [
  {
    name: 'Node.js',
    command: 'node',
    args: ['--version'],
    required: true,
    hint: 'Install Node.js 22.13 or newer from https://nodejs.org',
  },
  {
    name: 'npm',
    command: 'npm',
    args: ['--version'],
    required: true,
    hint: 'Comes bundled with Node.js',
  },
  {
    name: 'git',
    command: 'git',
    args: ['--version'],
    required: false,
    hint: 'Install git to initialize generated projects',
  },
  {
    name: 'Flutter',
    command: 'flutter',
    args: ['--version'],
    required: false,
    hint: 'Required for Flutter projects: https://docs.flutter.dev/get-started/install',
  },
  {
    name: 'Java',
    command: 'java',
    args: ['-version'],
    required: false,
    hint: 'JDK 17+ is required for Android/KMP builds',
  },
  {
    name: 'Xcode',
    command: 'xcodebuild',
    args: ['-version'],
    required: false,
    hint: 'Required for iOS builds (macOS only)',
  },
  {
    name: 'Android SDK',
    command: ANDROID_HOME
      ? path.join(ANDROID_HOME, 'platform-tools', 'adb')
      : 'sdkmanager',
    args: ANDROID_HOME ? ['version'] : ['--version'],
    required: false,
    hint: 'Install Android Studio and the SDK for Android builds',
  },
];

function check(tool: ToolCheck): { ok: boolean; detail: string } {
  const result = spawnSync(tool.command, tool.args, {
    encoding: 'utf-8',
    stdio: 'pipe',
    shell: process.platform === 'win32' && !tool.command.includes(path.sep),
  });

  if (result.error || result.status !== 0) {
    return { ok: false, detail: 'not found' };
  }

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  const firstLine = output.split('\n')[0]?.trim() ?? 'available';
  return { ok: true, detail: firstLine.slice(0, 80) };
}

function parseNodeVersion(version: string): number[] {
  return version
    .replace(/^v/, '')
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0);
}

function nodeIsSupported(version: string): boolean {
  const [major = 0, minor = 0] = parseNodeVersion(version);
  return major > 22 || (major === 22 && minor >= 13);
}

export function doctorCommand(): void {
  logger.title('🩺 Environment Check');

  let requiredFailures = 0;
  let nodeDetail = '';

  for (const tool of TOOLS) {
    const result = check(tool);
    const label = tool.name.padEnd(14);

    if (tool.name === 'Node.js') nodeDetail = result.detail;

    if (result.ok) {
      console.log(
        `  ${chalk.green('✔')} ${label} ${chalk.gray(result.detail)}`
      );
    } else if (tool.required) {
      requiredFailures += 1;
      console.log(`  ${chalk.red('✖')} ${label} ${chalk.red('not found')}`);
      console.log(`    ${chalk.gray(tool.hint)}`);
    } else {
      console.log(
        `  ${chalk.yellow('⚠')} ${label} ${chalk.gray('not found (optional)')}`
      );
      console.log(`    ${chalk.gray(tool.hint)}`);
    }
  }

  logger.blank();

  if (!nodeDetail) {
    logger.error('Node.js is required. Install Node.js 22.13 or newer.');
    process.exitCode = 1;
    return;
  }

  if (!nodeIsSupported(nodeDetail)) {
    logger.error(
      `Node.js ${nodeDetail} is too old. Mobile App Starter Kit requires Node.js 22.13 or newer.`
    );
    process.exitCode = 1;
    return;
  }

  if (requiredFailures > 0) {
    logger.warn('Some required tools are missing.');
    process.exitCode = 1;
    return;
  }

  logger.success('Your environment is ready to generate projects.');
  logger.info(
    'Optional toolchains that are missing only affect that framework.'
  );

  logger.blank();
  logger.info(`ANDROID_HOME: ${ANDROID_HOME ?? chalk.gray('not set')}`);

  const sdkPlatforms = ANDROID_HOME
    ? path.join(ANDROID_HOME, 'platforms')
    : null;
  logger.info(
    `Android platform: ${
      sdkPlatforms
        ? chalk.gray(
            'run `sdkmanager --list` to verify android-36 is installed'
          )
        : chalk.gray('not detected')
    }`
  );
}
