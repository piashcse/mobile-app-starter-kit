import { logger } from '../utils/logger.js';

interface AddOptions {
  screen?: string;
  framework?: string;
}

export async function addCommand(options: AddOptions): Promise<void> {
  logger.title('➕ Add Screen');
  logger.warn('The "add" command is coming soon!');
  logger.info(
    'For now, run "mobile-app-starter-kit init" to generate a project with your desired screens.'
  );
}
