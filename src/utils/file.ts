import path from 'path';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Directories that must never be copied from templates into a generated project. */
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.gradle',
  '.idea',
  '.dart_tool',
  'build',
  '.build',
  'Pods',
  'DerivedData',
]);

/** Files that must never be copied from templates into a generated project. */
const IGNORED_FILES = new Set(['.DS_Store', 'Thumbs.db', 'local.properties']);

/**
 * Get the absolute path to the templates directory
 */
export function getTemplatesDir(): string {
  // In development (src/utils) and production (dist/utils) both resolve two
  // levels up to the package root.
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
 * Copy a file, processing it as a Handlebars template if it has .hbs extension.
 * Throws with the offending file path when rendering fails.
 */
export async function copyTemplateFile(
  src: string,
  dest: string,
  context: Record<string, unknown>
): Promise<void> {
  await fs.ensureDir(path.dirname(dest));

  try {
    if (src.endsWith('.hbs')) {
      const rendered = renderTemplate(src, context);
      const finalDest = dest.replace(/\.hbs$/, '');
      await fs.writeFile(finalDest, rendered, 'utf-8');
    } else {
      await fs.copy(src, dest);
    }
  } catch (error) {
    throw new Error(
      `Failed to render template "${path.relative(getTemplatesDir(), src)}": ${
        (error as Error).message
      }`
    );
  }
}

/**
 * Recursively copy a directory, processing .hbs templates.
 * Also processes Handlebars placeholders in filenames.
 */
export async function copyTemplateDir(
  srcDir: string,
  destDir: string,
  context: Record<string, unknown>
): Promise<void> {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && IGNORED_DIRS.has(entry.name)) continue;
    if (entry.isFile() && IGNORED_FILES.has(entry.name)) continue;

    const srcPath = path.join(srcDir, entry.name);

    // Process filename: replace .hbs and render any Handlebars placeholders
    let destName = entry.name.endsWith('.hbs')
      ? entry.name.replace(/\.hbs$/, '')
      : entry.name;

    // npm excludes dotfiles like .gitignore from published packages, so the
    // templates store them without the dot and they are restored here.
    if (destName === 'gitignore') destName = '.gitignore';

    if (destName.includes('{{')) {
      const template = Handlebars.compile(destName);
      destName = template(context);
    }

    const destPath = path.join(destDir, destName);

    if (entry.isDirectory()) {
      await copyTemplateDir(srcPath, destPath, context);
    } else {
      await copyTemplateFile(srcPath, destPath, context);
    }
  }
}

/** Convert any project name to a URL/file friendly kebab-case slug. */
export function toKebab(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/** Convert any project name to a snake_case identifier (Dart package names). */
export function toSnake(name: string): string {
  return toKebab(name).replace(/-/g, '_');
}

/**
 * Java/Kotlin keywords (and literals) cannot be used as package segments.
 * `com.example.final` is rejected by the Android Gradle Plugin.
 */
const RESERVED_PACKAGE_SEGMENTS = new Set([
  'abstract',
  'actual',
  'annotation',
  'as',
  'assert',
  'boolean',
  'break',
  'byte',
  'by',
  'case',
  'catch',
  'char',
  'class',
  'companion',
  'const',
  'constructor',
  'continue',
  'crossinline',
  'data',
  'default',
  'delegate',
  'do',
  'double',
  'dynamic',
  'else',
  'enum',
  'expect',
  'external',
  'false',
  'field',
  'file',
  'final',
  'finally',
  'float',
  'for',
  'fun',
  'get',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'infix',
  'init',
  'inline',
  'inner',
  'instanceof',
  'int',
  'interface',
  'internal',
  'is',
  'lateinit',
  'long',
  'native',
  'new',
  'noinline',
  'null',
  'object',
  'open',
  'operator',
  'out',
  'override',
  'package',
  'param',
  'private',
  'property',
  'protected',
  'public',
  'receiver',
  'record',
  'reified',
  'return',
  'sealed',
  'set',
  'short',
  'static',
  'strictfp',
  'super',
  'suspend',
  'switch',
  'synchronized',
  'tailrec',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typealias',
  'typeof',
  'val',
  'var',
  'vararg',
  'void',
  'volatile',
  'when',
  'while',
  'yield',
]);

/** Convert a single package segment into a valid identifier. */
export function toPackageSegment(segment: string): string {
  let value = segment.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (value.length === 0) value = 'app';
  if (/^[0-9]/.test(value)) value = `app${value}`;
  if (RESERVED_PACKAGE_SEGMENTS.has(value)) value = `${value}app`;
  return value;
}

/** Convert any project name to a valid Android/iOS package identifier. */
export function toPackageName(name: string): string {
  const slug = toKebab(name);
  const compact = toPackageSegment(slug.replace(/-/g, ''));
  return compact.length > 0 ? compact : 'app';
}

export function isReservedPackageSegment(segment: string): boolean {
  return RESERVED_PACKAGE_SEGMENTS.has(segment.toLowerCase());
}

/** Split a kebab/snake/camel identifier into words. */
function splitWords(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
}

export function toCamel(value: string): string {
  const words = splitWords(value).map((w) => w.toLowerCase());
  if (words.length === 0) return '';
  return words[0] + words.slice(1).map(capitalize).join('');
}

export function toPascal(value: string): string {
  return splitWords(value).map(capitalize).join('');
}

function capitalize(word: string): string {
  if (!word) return '';
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Screen IDs use compact words ("signin") while human-friendly names use
 * separate words ("Sign In"). Keep an explicit override table so generated
 * symbols always match the hand-written template class names.
 */
const SCREEN_CASE_OVERRIDES: Record<
  string,
  { camel: string; pascal: string; title: string }
> = {
  signin: { camel: 'signIn', pascal: 'SignIn', title: 'Sign In' },
  signup: { camel: 'signUp', pascal: 'SignUp', title: 'Sign Up' },
};

/**
 * Convert a screen ID to the naming conventions used by all templates.
 */
export function screenIdToCases(screenId: string) {
  const words = screenId.split('-');
  const override = SCREEN_CASE_OVERRIDES[screenId];
  return {
    kebab: screenId,
    snake: words.join('_'),
    camel:
      override?.camel ??
      words[0] +
        words
          .slice(1)
          .map((w) => capitalize(w))
          .join(''),
    pascal: override?.pascal ?? words.map(capitalize).join(''),
    title: override?.title ?? words.map((w) => capitalize(w)).join(' '),
  };
}

/**
 * Derive every project identifier a generator needs from a free-form name.
 */
export function deriveProjectNames(name: string) {
  const slug = toKebab(name) || 'my-app';
  let dartPackage = toSnake(name) || 'my_app';
  if (/^[0-9]/.test(dartPackage)) dartPackage = `app_${dartPackage}`;
  if (RESERVED_PACKAGE_SEGMENTS.has(dartPackage)) {
    dartPackage = `${dartPackage}_app`;
  }

  return {
    projectName: name.trim(),
    dirName: slug,
    slug,
    dartPackage,
    packageName: `com.example.${toPackageName(name)}`,
  };
}
