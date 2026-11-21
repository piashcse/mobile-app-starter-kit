import { afterAll, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { generateProject } from '../src/generator.js';
import { DEFAULT_SCREENS, type Framework } from '../src/config.js';

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.json',
  '.kt',
  '.kts',
  '.dart',
  '.md',
  '.yml',
  '.yaml',
  '.xml',
  '.plist',
  '.swift',
  '.toml',
  '.properties',
  '.gradle',
  '.bat',
  '.gitignore',
  '.hbs',
  '.txt',
  '.lock',
]);

const tempDirs: string[] = [];

async function generate(
  framework: Framework,
  screens: string[] = DEFAULT_SCREENS,
  name = 'My Cool App'
) {
  const outputDir = await fs.mkdtemp(
    path.join(os.tmpdir(), `mask-test-${framework}-`)
  );
  tempDirs.push(outputDir);
  await generateProject({
    name,
    framework,
    screens,
    packageName: 'com.acme.cool',
    outputDir,
  });
  return outputDir;
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function textFiles(
  dir: string
): Promise<{ file: string; content: string }[]> {
  const files = await walk(dir);
  return files
    .filter((file) => {
      const base = path.basename(file);
      if (base === 'gradlew') return true;
      if (base.endsWith('.jar') || base.endsWith('.png')) return false;
      return TEXT_EXTENSIONS.has(path.extname(file));
    })
    .map((file) => ({ file, content: fs.readFileSync(file, 'utf-8') }));
}

afterAll(async () => {
  await Promise.all(tempDirs.map((dir) => fs.remove(dir)));
});

describe('generated projects', () => {
  it('never copies Gradle caches or leaves unrendered templates', async () => {
    for (const framework of ['expo', 'flutter', 'kmp'] as const) {
      const dir = await generate(framework);
      const files = await walk(dir);
      expect(
        files.some((file) => file.includes(`${path.sep}.gradle${path.sep}`))
      ).toBe(false);

      for (const { file, content } of await textFiles(dir)) {
        for (const marker of [
          '{{projectName}}',
          '{{appTitle}}',
          '{{postAuthRoute}}',
          '{{onboardingRoute}}',
          '{{#if',
          '{{/if',
          '{{#each',
          '{{/each',
        ]) {
          expect(content, `unrendered ${marker} in ${file}`).not.toContain(
            marker
          );
        }
      }
    }
  });

  it('generates a valid Expo project', async () => {
    const dir = await generate('expo');
    const pkg = await fs.readJson(path.join(dir, 'package.json'));
    const appJson = await fs.readJson(path.join(dir, 'app.json'));

    expect(pkg.name).toBe('my-cool-app');
    expect(appJson.expo.name).toBe('My Cool App');
    expect(appJson.expo.slug).toBe('my-cool-app');
    expect(appJson.expo.scheme).toBe('my-cool-app');

    for (const dep of [
      'expo-linear-gradient',
      'expo-secure-store',
      'expo-system-ui',
      'expo-router',
    ]) {
      expect(pkg.dependencies[dep], `missing dependency ${dep}`).toBeTruthy();
    }

    for (const asset of [
      appJson.expo.icon,
      appJson.expo.splash.image,
      appJson.expo.android.adaptiveIcon.foregroundImage,
    ]) {
      expect(await fs.pathExists(path.join(dir, asset))).toBe(true);
    }

    expect(await fs.pathExists(path.join(dir, '.gitignore'))).toBe(true);
    expect(await fs.pathExists(path.join(dir, 'README.md'))).toBe(true);
    expect(await fs.pathExists(path.join(dir, 'design-tokens.json'))).toBe(
      true
    );

    // Every route import must resolve with exact file casing.
    const routes = (await walk(path.join(dir, 'app'))).filter((file) =>
      file.endsWith('.tsx')
    );
    for (const route of routes) {
      const content = await fs.readFile(route, 'utf-8');
      const importMatch = /from '(\.\.\/[^']+)'/.exec(content);
      if (!importMatch) continue;
      const resolved = path.resolve(path.dirname(route), importMatch[1]);
      const candidates = [`${resolved}.tsx`, `${resolved}.ts`, resolved];
      const exists = (
        await Promise.all(candidates.map((c) => fs.pathExists(c)))
      ).some(Boolean);
      expect(exists, `unresolved import in ${route}: ${importMatch[1]}`).toBe(
        true
      );
    }

    // Sign-in must never link to screens that were not generated.
    const limited = await generate('expo', ['signin']);
    const signIn = await fs.readFile(
      path.join(limited, 'src', 'features', 'signin', 'SignInScreen.tsx'),
      'utf-8'
    );
    expect(signIn).not.toContain('/(auth)/signup');
    expect(signIn).not.toContain('/(auth)/forgot-password');
    expect(signIn).not.toContain('/(main)/');
    expect(signIn).toContain('useTranslation');
    expect(signIn).toContain("t('auth.signIn.title')");
    expect(signIn).not.toContain('Welcome Back');
    expect(
      await fs.pathExists(path.join(dir, 'src', 'i18n', 'catalogs.ts'))
    ).toBe(true);
    expect(
      await fs.pathExists(path.join(dir, 'src', 'i18n', 'I18nProvider.tsx'))
    ).toBe(true);
    expect(signIn).toContain('LanguageSwitcher');
    expect(
      await fs.pathExists(path.join(dir, 'src', 'i18n', 'catalogs.ts'))
    ).toBe(true);
    expect(
      await fs.pathExists(path.join(dir, 'src', 'i18n', 'I18nProvider.tsx'))
    ).toBe(true);
  });

  it('generates a valid Flutter project', async () => {
    const dir = await generate('flutter');
    const pubspec = await fs.readFile(path.join(dir, 'pubspec.yaml'), 'utf-8');
    expect(pubspec).toContain('name: my_cool_app');

    const router = await fs.readFile(
      path.join(dir, 'lib', 'core', 'router', 'app_router.dart'),
      'utf-8'
    );
    const imports = [...router.matchAll(/import '([^']+)'/g)].map((m) => m[1]);
    for (const relative of imports) {
      if (!relative.startsWith('.')) continue;
      const resolved = path.resolve(
        path.dirname(
          path.join(dir, 'lib', 'core', 'router', 'app_router.dart')
        ),
        relative
      );
      expect(await fs.pathExists(resolved), `missing ${relative}`).toBe(true);
    }

    for (const match of router.matchAll(/const (\w+Screen)\(\)/g)) {
      const className = match[1];
      const files = await textFiles(path.join(dir, 'lib'));
      expect(
        files.some((file) => file.content.includes(`class ${className}`)),
        `router references missing class ${className}`
      ).toBe(true);
    }

    // Native folders require the Flutter SDK; CI exercises them separately.
    const gradlePath = path.join(dir, 'android', 'app', 'build.gradle.kts');
    if (await fs.pathExists(gradlePath)) {
      const gradle = await fs.readFile(gradlePath, 'utf-8');
      expect(gradle).toContain('namespace = "com.acme.cool"');
      expect(gradle).toContain('applicationId = "com.acme.cool"');
    }

    expect(await fs.pathExists(path.join(dir, '.gitignore'))).toBe(true);
    expect(await fs.pathExists(path.join(dir, 'assets', 'images'))).toBe(true);
    expect(await fs.pathExists(path.join(dir, 'design-tokens.json'))).toBe(
      true
    );

    const signIn = await fs.readFile(
      path.join(
        dir,
        'lib',
        'features',
        'signin',
        'presentation',
        'signin_screen.dart'
      ),
      'utf-8'
    );
    expect(signIn).toContain('AppLocalizations.of(context)');
    expect(signIn).toContain('auth.signIn.title');
    expect(signIn).toContain('LanguageSwitcher');
    expect(signIn).not.toContain('Welcome Back');
    expect(
      await fs.pathExists(
        path.join(dir, 'lib', 'core', 'l10n', 'app_localizations.dart')
      )
    ).toBe(true);
    expect(
      await fs.pathExists(
        path.join(dir, 'lib', 'core', 'l10n', 'language_switcher.dart')
      )
    ).toBe(true);
    expect(
      await fs.pathExists(
        path.join(dir, 'test', 'core', 'l10n', 'app_localizations_test.dart')
      )
    ).toBe(true);
  });

  it('generates a valid KMP project', async () => {
    const dir = await generate('kmp');
    const toml = await fs.readFile(
      path.join(dir, 'gradle', 'libs.versions.toml'),
      'utf-8'
    );
    const buildFiles = [
      path.join(dir, 'composeApp', 'build.gradle.kts'),
      path.join(dir, 'androidApp', 'build.gradle.kts'),
    ];
    const buildContents = await Promise.all(
      buildFiles.map((file) => fs.readFile(file, 'utf-8'))
    );

    // Every libs.* accessor used by a build script must exist in the catalog.
    const accessors = new Set<string>();
    for (const content of buildContents) {
      for (const match of content.matchAll(/libs\.((?:versions\.)?[\w.]+)/g)) {
        const parts = match[1].split('.');
        while (
          parts.length > 0 &&
          ['get', 'toInt', 'orNull', 'version'].includes(
            parts[parts.length - 1]
          )
        ) {
          parts.pop();
        }
        accessors.add(parts.join('.'));
      }
    }
    for (const accessor of accessors) {
      let key: string;
      if (accessor.startsWith('plugins.')) {
        key = accessor.slice('plugins.'.length);
      } else if (accessor.startsWith('versions.')) {
        key = accessor.replace(/^versions\./, '').replace(/\./g, '-');
      } else {
        key = accessor
          .replace(/\./g, '-')
          .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
          .toLowerCase();
      }
      expect(toml, `missing catalog entry for libs.${accessor}`).toContain(key);
    }

    for (const file of [
      'gradlew',
      'gradlew.bat',
      'gradle/wrapper/gradle-wrapper.jar',
    ]) {
      expect(await fs.pathExists(path.join(dir, file)), `missing ${file}`).toBe(
        true
      );
    }

    expect(buildContents[0]).toContain('androidLibrary');
    expect(buildContents[0]).toContain('kotlinSerialization');
    expect(buildContents[0]).toContain('namespace = "com.acme.cool"');

    expect(buildContents[0]).toContain('libs.navigation3.ui');
    expect(buildContents[0]).not.toContain('libs.navigation.compose');

    const navigation = await fs.readFile(
      path.join(
        dir,
        'composeApp',
        'src',
        'commonMain',
        'kotlin',
        'navigation',
        'AppNavigation.kt'
      ),
      'utf-8'
    );
    for (const match of navigation.matchAll(
      /import features\.(\w+)\.view\.(\w+Screen)/g
    )) {
      const [, module, className] = match;
      const screenFile = path.join(
        dir,
        'composeApp',
        'src',
        'commonMain',
        'kotlin',
        'features',
        module,
        'view',
        `${className}.kt`
      );
      expect(
        await fs.pathExists(screenFile),
        `missing screen ${module}/${className}`
      ).toBe(true);
      const content = await fs.readFile(screenFile, 'utf-8');
      expect(content).toContain(`fun ${className}(`);
    }

    expect(await fs.pathExists(path.join(dir, '.gitignore'))).toBe(true);
    expect(await fs.pathExists(path.join(dir, 'design-tokens.json'))).toBe(
      true
    );
    expect(await fs.pathExists(path.join(dir, 'iosApp', 'project.yml'))).toBe(
      true
    );

    const signIn = await fs.readFile(
      path.join(
        dir,
        'composeApp',
        'src',
        'commonMain',
        'kotlin',
        'features',
        'signin',
        'view',
        'SignInScreen.kt'
      ),
      'utf-8'
    );
    expect(signIn).toContain('stringResource(Res.string.auth_sign_in_title)');
    expect(signIn).toContain('LanguageSwitcher');
    expect(signIn).not.toContain('Welcome Back');
    expect(navigation).toContain('NavDisplay(');
    expect(navigation).toContain('rememberNavBackStack');
    expect(navigation).toContain('sealed interface AppRoute : NavKey');
    expect(navigation).not.toContain('NavHost(');
    expect(
      await fs.pathExists(
        path.join(
          dir,
          'composeApp',
          'src',
          'commonMain',
          'composeResources',
          'values',
          'strings.xml'
        )
      )
    ).toBe(true);
    expect(
      await fs.pathExists(
        path.join(
          dir,
          'composeApp',
          'src',
          'commonMain',
          'composeResources',
          'values-es',
          'strings.xml'
        )
      )
    ).toBe(true);

    const englishStrings = await fs.readFile(
      path.join(
        dir,
        'composeApp',
        'src',
        'commonMain',
        'composeResources',
        'values',
        'strings.xml'
      ),
      'utf-8'
    );
    const spanishStrings = await fs.readFile(
      path.join(
        dir,
        'composeApp',
        'src',
        'commonMain',
        'composeResources',
        'values-es',
        'strings.xml'
      ),
      'utf-8'
    );
    expect(englishStrings).toContain('name="auth_sign_in_title"');
    expect(englishStrings).toContain('Welcome Back');
    expect(spanishStrings).toContain('Bienvenido de nuevo');
    expect(
      await fs.pathExists(
        path.join(
          dir,
          'composeApp',
          'src',
          'commonMain',
          'kotlin',
          'core',
          'error',
          'AppError.kt'
        )
      )
    ).toBe(true);
    expect(
      await fs.pathExists(
        path.join(
          dir,
          'composeApp',
          'src',
          'commonMain',
          'kotlin',
          'core',
          'validation',
          'Validators.kt'
        )
      )
    ).toBe(true);
    expect(
      await fs.pathExists(
        path.join(
          dir,
          'composeApp',
          'src',
          'commonTest',
          'kotlin',
          'core',
          'validation',
          'ValidatorsTest.kt'
        )
      )
    ).toBe(true);

    const settings = await fs.readFile(
      path.join(
        dir,
        'composeApp',
        'src',
        'commonMain',
        'kotlin',
        'features',
        'settings',
        'view',
        'SettingsScreen.kt'
      ),
      'utf-8'
    );
    expect(settings).toContain('stringResource(Res.string.settings_title)');
    expect(settings).not.toContain('PREFERENCES');
    expect(
      await fs.pathExists(
        path.join(
          dir,
          'composeApp',
          'src',
          'androidMain',
          'kotlin',
          'core',
          'i18n',
          'LocaleStore.android.kt'
        )
      )
    ).toBe(true);
    expect(
      await fs.pathExists(
        path.join(
          dir,
          'composeApp',
          'src',
          'iosMain',
          'kotlin',
          'core',
          'i18n',
          'LocaleStore.ios.kt'
        )
      )
    ).toBe(true);
  });

  it('emits identical design tokens on every platform', async () => {
    const expo = await generate('expo');
    const flutter = await generate('flutter');
    const kmp = await generate('kmp');

    const tokens = await fs.readJson(path.join(expo, 'design-tokens.json'));
    expect(tokens.colors.light.primary).toBe('#6366F1');
    expect(tokens.colors.dark.background).toBe('#0F172A');

    const expoColors = await fs.readFile(
      path.join(expo, 'src', 'theme', 'colors.ts'),
      'utf-8'
    );
    const flutterColors = await fs.readFile(
      path.join(flutter, 'lib', 'core', 'theme', 'app_colors.dart'),
      'utf-8'
    );
    const kmpColors = await fs.readFile(
      path.join(
        kmp,
        'composeApp',
        'src',
        'commonMain',
        'kotlin',
        'core',
        'theme',
        'AppColors.kt'
      ),
      'utf-8'
    );

    for (const source of [expoColors, flutterColors, kmpColors]) {
      expect(source).toContain('6366F1');
      expect(source).toContain('0F172A');
      expect(source).toContain('EF4444');
    }
  });
});
