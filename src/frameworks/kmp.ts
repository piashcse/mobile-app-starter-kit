import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from '../config.js';
import { getTemplatesDir, copyTemplateDir, screenIdToCases } from '../utils/file.js';
import { logger } from '../utils/logger.js';

export async function generateKmpProject(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const templatesDir = getTemplatesDir();
  const baseDir = path.join(templatesDir, 'kmp', 'base');
  const screensDir = path.join(templatesDir, 'kmp', 'screens');

  // Step 1: Copy base template
  logger.step(1, 4, 'Copying base KMP project...');
  await copyTemplateDir(baseDir, config.outputDir, context);

  // Step 2: Copy selected screen modules (MVVM)
  logger.step(2, 4, 'Adding selected features...');
  for (const screenId of config.screens) {
    const screenSrcDir = path.join(screensDir, screenId);
    if (await fs.pathExists(screenSrcDir)) {
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
  }

  // Step 3: Generate navigation graph
  logger.step(3, 4, 'Generating navigation...');
  await generateKmpNavigation(config, context);

  // Step 4: Generate ViewModel registrations
  logger.step(4, 4, 'Setting up ViewModels...');
  await generateKmpViewModels(config, context);
}

async function generateKmpNavigation(
  config: ProjectConfig,
  _context: Record<string, unknown>
): Promise<void> {
  const navDir = path.join(
    config.outputDir,
    'composeApp',
    'src',
    'commonMain',
    'kotlin',
    'navigation'
  );
  await fs.ensureDir(navDir);

  const imports: string[] = [];
  const screenDefs: string[] = [];
  const tabDefs: string[] = [];

  for (const screenId of config.screens) {
    const cases = screenIdToCases(screenId);
    const moduleDir = screenId.replace(/-/g, '');
    imports.push(`import features.${moduleDir}.view.${cases.pascal}Screen`);

    screenDefs.push(`    object ${cases.pascal} : Screen {
        @Composable
        override fun Content() {
            ${cases.pascal}Screen()
        }
    }`);
  }

  const navContent = `package navigation

import cafe.adriel.voyager.core.screen.Screen
import androidx.compose.runtime.Composable
${imports.join('\n')}

sealed class AppScreen {
${screenDefs.join('\n\n')}
}
`;

  await fs.writeFile(path.join(navDir, 'AppScreen.kt'), navContent);
}

async function generateKmpViewModels(
  config: ProjectConfig,
  _context: Record<string, unknown>
): Promise<void> {
  const diDir = path.join(
    config.outputDir,
    'composeApp',
    'src',
    'commonMain',
    'kotlin',
    'di'
  );
  await fs.ensureDir(diDir);

  const imports: string[] = [];
  const registrations: string[] = [];

  for (const screenId of config.screens) {
    const cases = screenIdToCases(screenId);
    const moduleDir = screenId.replace(/-/g, '');
    imports.push(`import features.${moduleDir}.viewmodel.${cases.pascal}ViewModel`);
    registrations.push(`    val ${cases.camel}ViewModel = ${cases.pascal}ViewModel(apiClient)`);
  }

  const diContent = `package di

import core.api.ApiClient
${imports.join('\n')}

object ViewModelProvider {
    private val apiClient = ApiClient()

${registrations.join('\n')}
}
`;

  await fs.writeFile(path.join(diDir, 'ViewModelProvider.kt'), diContent);
}
