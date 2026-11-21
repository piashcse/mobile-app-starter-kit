import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from '../../config.js';
import { screenIdToCases } from '../../utils/file.js';

export async function generateKmpNavigation(
  config: ProjectConfig,
  context: Record<string, unknown>
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

  const selected = new Set(config.screens);
  const imports: string[] = [];
  const routes: string[] = [];
  const entries: string[] = [];

  for (const screenId of config.screens) {
    const cases = screenIdToCases(screenId);
    const moduleDir = screenId.replace(/-/g, '');
    imports.push(`import features.${moduleDir}.view.${cases.pascal}Screen`);
    routes.push(`@Serializable\ndata object ${cases.pascal} : AppRoute`);
  }

  const pushTo = (id: string) => `backStack.add(${screenIdToCases(id).pascal})`;

  const postAuthId = getScreenIdFromCases(context.postAuthScreen);
  const startId = getScreenIdFromCases(context.initialScreen);
  const startDest = startId ? screenIdToCases(startId).pascal : 'SignIn';

  const formatArgs = (args: string[]): string => {
    if (args.length === 0) return '()';
    const indented = args
      .map((arg) =>
        arg
          .split('\n')
          .map((line) => `${' '.repeat(24)}${line}`)
          .join('\n')
      )
      .join(',\n');
    return `(\n${indented},\n${' '.repeat(20)})`;
  };

  for (const screenId of config.screens) {
    const cases = screenIdToCases(screenId);
    const args: string[] = [];

    if (screenId === 'signin') {
      if (selected.has('signup')) {
        args.push('onNavigateToSignUp = { backStack.add(SignUp) }');
      }
      if (selected.has('forgot-password')) {
        args.push(
          'onNavigateToForgotPassword = { backStack.add(ForgotPassword) }'
        );
      }
      if (postAuthId && postAuthId !== 'signin') {
        args.push(
          `onSignInSuccess = { resetTo(${screenIdToCases(postAuthId).pascal}) }`
        );
      }
    }

    if (screenId === 'signup') {
      if (postAuthId && postAuthId !== 'signup') {
        args.push(
          `onSuccess = { resetTo(${screenIdToCases(postAuthId).pascal}) }`
        );
      }
      if (selected.has('signin')) {
        args.push('onNavigateToSignIn = { resetTo(SignIn) }');
      }
    }

    if (screenId === 'change-password') {
      args.push('onSuccess = { backStack.removeLastOrNull() }');
    }

    if (screenId === 'forgot-password') {
      args.push('onBack = { backStack.removeLastOrNull() }');
    }

    if (screenId === 'onboarding') {
      if (postAuthId && postAuthId !== 'onboarding') {
        args.push(
          `onFinish = { resetTo(${screenIdToCases(postAuthId).pascal}) }`
        );
      }
    }

    if (screenId === 'profile') {
      if (selected.has('settings')) {
        args.push(`onNavigateToSettings = { ${pushTo('settings')} }`);
      }
      if (selected.has('signin')) {
        args.push('onSignOut = { resetTo(SignIn) }');
      }
    }

    if (screenId === 'settings') {
      const navCases = config.screens
        .filter((id) =>
          [
            'change-password',
            'privacy-policy',
            'terms',
            'faq',
            'about',
          ].includes(id)
        )
        .map(
          (id) =>
            `        "${id}" -> backStack.add(${screenIdToCases(id).pascal})`
        );
      if (navCases.length > 0) {
        args.push(
          `onNavigate = { id ->
    when (id) {
${navCases.join('\n')}
        else -> Unit
    }
}`
        );
      }
    }

    entries.push(`                entry<${cases.pascal}> {
                    ${cases.pascal}Screen${formatArgs(args)}
                }`);
  }

  const navContent = `package navigation

import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation3.runtime.NavKey
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import androidx.savedstate.serialization.SavedStateConfiguration
import kotlinx.serialization.Serializable
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.polymorphic
import kotlinx.serialization.modules.subclassesOfSealed
${imports.join('\n')}

// Navigation 3 uses a user-owned back stack of serializable keys.
@Serializable
sealed interface AppRoute : NavKey

${routes.join('\n')}

@OptIn(kotlinx.serialization.ExperimentalSerializationApi::class)
private val navConfig = SavedStateConfiguration {
    serializersModule = SerializersModule {
        polymorphic(NavKey::class) {
            subclassesOfSealed<AppRoute>()
        }
    }
}

@Composable
fun AppNavigation() {
    val backStack = rememberNavBackStack(navConfig, ${startDest})

    val resetTo: (NavKey) -> Unit = { route ->
        backStack.clear()
        backStack.add(route)
    }

    Surface(
        modifier = Modifier
            .fillMaxSize()
            .windowInsetsPadding(WindowInsets.safeDrawing),
        color = MaterialTheme.colorScheme.background,
    ) {
        NavDisplay(
            backStack = backStack,
            onBack = { backStack.removeLastOrNull() },
            entryProvider = entryProvider {
${entries.join('\n\n')}
            },
        )
    }
}
`;

  await fs.writeFile(
    path.join(navDir, 'AppNavigation.kt'),
    navContent,
    'utf-8'
  );
}

function getScreenIdFromCases(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;
  const kebab = (value as { kebab?: string }).kebab;
  return typeof kebab === 'string' ? kebab : null;
}
