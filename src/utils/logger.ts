import chalk from 'chalk';

export const logger = {
  info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✔'), msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  error: (msg: string) => console.log(chalk.red('✖'), msg),
  title: (msg: string) =>
    console.log('\n' + chalk.bold.cyan('━'.repeat(50)) + '\n' + chalk.bold.white(`  ${msg}`) + '\n' + chalk.bold.cyan('━'.repeat(50)) + '\n'),
  step: (step: number, total: number, msg: string) =>
    console.log(chalk.gray(`[${step}/${total}]`), chalk.white(msg)),
  blank: () => console.log(),
};
