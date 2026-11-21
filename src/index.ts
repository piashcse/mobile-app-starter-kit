#!/usr/bin/env node

import { createCli } from './cli.js';
import { logger } from './utils/logger.js';

const cli = createCli();

process.on('SIGINT', () => {
  logger.stopSpinnerQuietly();
  console.log('\nCancelled.');
  process.exit(130);
});

cli.parseAsync(process.argv).catch((error: unknown) => {
  logger.stopSpinnerQuietly();
  logger.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
