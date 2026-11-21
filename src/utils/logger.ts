import chalk from 'chalk';
import ora, { type Ora } from 'ora';

let activeSpinner: Ora | null = null;

export const logger = {
  info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✔'), msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  error: (msg: string) => console.error(chalk.red('✖'), msg),
  title: (msg: string) =>
    console.log(
      '\n' +
        chalk.bold.cyan('━'.repeat(50)) +
        '\n' +
        chalk.bold.white(`  ${msg}`) +
        '\n' +
        chalk.bold.cyan('━'.repeat(50)) +
        '\n'
    ),
  step: (step: number, total: number, msg: string) => {
    const label = chalk.gray(`[${step}/${total}]`) + ' ' + chalk.white(msg);
    if (activeSpinner) {
      activeSpinner.text = `${chalk.gray(`[${step}/${total}]`)} ${msg}`;
    } else {
      console.log(chalk.gray(`[${step}/${total}]`), chalk.white(msg));
    }
    return label;
  },
  blank: () => console.log(),

  startSpinner: (text: string) => {
    activeSpinner = ora(text).start();
    return activeSpinner;
  },
  updateSpinner: (text: string) => {
    if (activeSpinner) activeSpinner.text = text;
  },
  stopSpinner: (success: boolean, text: string) => {
    if (!activeSpinner) return;
    if (success) activeSpinner.succeed(text);
    else activeSpinner.fail(text);
    activeSpinner = null;
  },
  stopSpinnerQuietly: () => {
    if (!activeSpinner) return;
    activeSpinner.stop();
    activeSpinner = null;
  },
};

/** Log an error and terminate with a non-zero exit code. */
export function fail(message: string): never {
  logger.stopSpinnerQuietly();
  logger.error(message);
  process.exit(1);
}
