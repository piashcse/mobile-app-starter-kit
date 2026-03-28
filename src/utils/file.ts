import path from 'path';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the absolute path to the templates directory
 */
export function getTemplatesDir(): string {
  // In development (src/), go up 2 levels; in dist/, go up 2 levels
  return path.resolve(__dirname, '..', '..', 'templates');
}

/**
 * Process a Handlebars template file and return the rendered content
 */
export function renderTemplate(
  templatePath: string,
  context: Record<string, unknown>
): string {
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);
  return template(context);
}

/**
 * Copy a file, processing it as a Handlebars template if it has .hbs extension
 */
export async function copyTemplateFile(
  src: string,
  dest: string,
  context: Record<string, unknown>
): Promise<void> {
  await fs.ensureDir(path.dirname(dest));

  if (src.endsWith('.hbs')) {
    const rendered = renderTemplate(src, context);
    const finalDest = dest.replace(/\.hbs$/, '');
    await fs.writeFile(finalDest, rendered, 'utf-8');
  } else {
    await fs.copy(src, dest);
  }
}

/**
 * Recursively copy a directory, processing .hbs templates
 */
export async function copyTemplateDir(
  srcDir: string,
  destDir: string,
  context: Record<string, unknown>
): Promise<void> {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destName = entry.name.endsWith('.hbs')
      ? entry.name.replace(/\.hbs$/, '')
      : entry.name;
    const destPath = path.join(destDir, destName);

    if (entry.isDirectory()) {
      await copyTemplateDir(srcPath, destPath, context);
    } else {
      await copyTemplateFile(srcPath, destPath, context);
    }
  }
}

/**
 * Convert a project name to a valid package name
 */
export function toPackageName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Convert a screen ID to various case formats
 */
export function screenIdToCases(screenId: string) {
  const words = screenId.split('-');
  return {
    kebab: screenId,
    snake: words.join('_'),
    camel: words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join(''),
    pascal: words.map(w => w[0].toUpperCase() + w.slice(1)).join(''),
    title: words.map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
  };
}
