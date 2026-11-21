import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from '../../config.js';
import { screenIdToCases } from '../../utils/file.js';

export async function generateKmpViewModels(
  config: ProjectConfig
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
  const factories: string[] = [];

  for (const screenId of config.screens) {
    const cases = screenIdToCases(screenId);
    const moduleDir = screenId.replace(/-/g, '');
    const vmFile = path.join(
      config.outputDir,
      'composeApp',
      'src',
      'commonMain',
      'kotlin',
      'features',
      moduleDir,
      'viewmodel',
      `${cases.pascal}ViewModel.kt`
    );
    if (!(await fs.pathExists(vmFile))) continue;

    imports.push(
      `import features.${moduleDir}.viewmodel.${cases.pascal}ViewModel`
    );
    factories.push(
      `    fun ${cases.camel}ViewModel() = ${cases.pascal}ViewModel(apiClient)`
    );
  }

  const diContent = `package di

import core.api.ApiClient
${imports.join('\n')}

object ViewModelProvider {
    private val apiClient = ApiClient()

${factories.join('\n')}
}
`;

  await fs.writeFile(
    path.join(diDir, 'ViewModelProvider.kt'),
    diContent,
    'utf-8'
  );
}
