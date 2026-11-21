import path from 'path';
import fs from 'fs-extra';
import {
  componentTokens,
  darkColors,
  lightColors,
  motion,
  radii,
  spacing,
  typography,
} from './tokens.js';
import { supportedLocales } from './strings.js';

export async function writeDesignTokensJson(outputDir: string): Promise<void> {
  const document = {
    version: '1.0.0',
    colors: { light: lightColors, dark: darkColors },
    spacing,
    radii,
    typography,
    components: componentTokens,
    motion,
    locales: supportedLocales,
  };
  await fs.writeFile(
    path.join(outputDir, 'design-tokens.json'),
    `${JSON.stringify(document, null, 2)}\n`,
    'utf-8'
  );
}

// ---------------------------------------------------------------------------
// Expo
// ---------------------------------------------------------------------------
