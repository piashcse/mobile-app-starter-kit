import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from '../config.js';
import {
  getTemplatesDir,
  copyTemplateDir,
  screenIdToCases,
} from '../utils/file.js';
import { logger } from '../utils/logger.js';
import { writeKmpDesign } from '../design/generate.js';
import { generateKmpBuildFiles } from './kmp/gradle.js';
import { generateKmpNativeFiles } from './kmp/native.js';
import { generateKmpNavigation } from './kmp/navigation.js';
import { generateKmpViewModels } from './kmp/viewmodels.js';

export async function generateKmpProject(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const templatesDir = getTemplatesDir();
  const baseDir = path.join(templatesDir, 'kmp', 'base');
  const screensDir = path.join(templatesDir, 'kmp', 'screens');

  // Step 1: Copy shared code and Gradle wrapper
  logger.step(1, 5, 'Copying shared KMP code...');
  await copyTemplateDir(baseDir, config.outputDir, context);
  await writeKmpDesign(config.outputDir);

  // Step 2: Generate Gradle build files and native entry points
  logger.step(2, 5, 'Generating Gradle build files...');
  await generateKmpBuildFiles(config, context);
  await generateKmpNativeFiles(config, context);

  // Step 3: Copy selected screen modules (MVVM)
  logger.step(3, 5, 'Adding selected features...');
  for (const screenId of config.screens) {
    const screenSrcDir = path.join(screensDir, screenId);
    if (!(await fs.pathExists(screenSrcDir))) {
      throw new Error(
        `Missing KMP template for screen "${screenId}" (${screenSrcDir}).`
      );
    }
    const screenDestDir = path.join(
      config.outputDir,
      'composeApp',
      'src',
      'commonMain',
      'kotlin',
      'features',
      screenId.replace(/-/g, '')
    );
    await copyTemplateDir(screenSrcDir, screenDestDir, {
      ...context,
      ...screenIdToCases(screenId),
    });
  }

  // Step 4: Generate navigation graph
  logger.step(4, 5, 'Generating navigation...');
  await generateKmpNavigation(config, context);

  // Step 5: Generate ViewModel factories
  logger.step(5, 5, 'Setting up ViewModels...');
  await generateKmpViewModels(config);

  // Gradle wrapper scripts must be executable on Unix.
  if (process.platform !== 'win32') {
    const gradlew = path.join(config.outputDir, 'gradlew');
    if (await fs.pathExists(gradlew)) {
      await fs.chmod(gradlew, 0o755);
    }
  }
}
