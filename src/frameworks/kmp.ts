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

const KOTLIN_VERSION = '2.4.21';
const COMPOSE_VERSION = '1.11.1';
const AGP_VERSION = '8.13.2';
const KTOR_VERSION = '3.6.1';
const NAVIGATION_VERSION = '1.1.2';
const COROUTINES_VERSION = '1.11.0';
const SERIALIZATION_VERSION = '1.13.0';
const ACTIVITY_COMPOSE_VERSION = '1.12.4';
const COMPILE_SDK = '36';
const MIN_SDK = '24';
const TARGET_SDK = '36';

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

async function generateKmpBuildFiles(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const outputDir = config.outputDir;
  const projectName = String(context.projectName);
  const packageName = config.packageName;

  const rootBuildGradle = `plugins {
    alias(libs.plugins.androidApplication) apply false
    alias(libs.plugins.androidLibrary) apply false
    alias(libs.plugins.composeMultiplatform) apply false
    alias(libs.plugins.composeCompiler) apply false
    alias(libs.plugins.kotlinMultiplatform) apply false
    alias(libs.plugins.kotlinAndroid) apply false
    alias(libs.plugins.kotlinSerialization) apply false
}
`;
  await fs.writeFile(
    path.join(outputDir, 'build.gradle.kts'),
    rootBuildGradle,
    'utf-8'
  );

  const settingsGradle = `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${projectName}"

include(":composeApp")
include(":androidApp")
`;
  await fs.writeFile(
    path.join(outputDir, 'settings.gradle.kts'),
    settingsGradle,
    'utf-8'
  );

  const gradleProperties = `org.gradle.jvmargs=-Xmx4g -Dfile.encoding=UTF-8
org.gradle.caching=true
org.gradle.parallel=true
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`;
  await fs.writeFile(
    path.join(outputDir, 'gradle.properties'),
    gradleProperties,
    'utf-8'
  );

  const libsVersions = `[versions]
agp = "${AGP_VERSION}"
kotlin = "${KOTLIN_VERSION}"
compose-multiplatform = "${COMPOSE_VERSION}"
compose-material3 = "1.9.0"
ktor = "${KTOR_VERSION}"
navigation3 = "${NAVIGATION_VERSION}"
kotlinx-coroutines = "${COROUTINES_VERSION}"
kotlinx-serialization = "${SERIALIZATION_VERSION}"
android-compileSdk = "${COMPILE_SDK}"
android-minSdk = "${MIN_SDK}"
android-targetSdk = "${TARGET_SDK}"
androidx-activityCompose = "${ACTIVITY_COMPOSE_VERSION}"

[libraries]
compose-runtime = { module = "org.jetbrains.compose.runtime:runtime", version.ref = "compose-multiplatform" }
compose-foundation = { module = "org.jetbrains.compose.foundation:foundation", version.ref = "compose-multiplatform" }
compose-material3 = { module = "org.jetbrains.compose.material3:material3", version.ref = "compose-material3" }
compose-ui = { module = "org.jetbrains.compose.ui:ui", version.ref = "compose-multiplatform" }
compose-components-resources = { module = "org.jetbrains.compose.components:components-resources", version.ref = "compose-multiplatform" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "androidx-activityCompose" }
ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
ktor-client-android = { module = "io.ktor:ktor-client-android", version.ref = "ktor" }
ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor" }
ktor-serialization-kotlinx-json = { module = "io.ktor:ktor-serialization-kotlinx-json", version.ref = "ktor" }
kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinx-coroutines" }
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinx-serialization" }
navigation3-ui = { module = "org.jetbrains.androidx.navigation3:navigation3-ui", version.ref = "navigation3" }

[plugins]
androidApplication = { id = "com.android.application", version.ref = "agp" }
androidLibrary = { id = "com.android.library", version.ref = "agp" }
composeMultiplatform = { id = "org.jetbrains.compose", version.ref = "compose-multiplatform" }
composeCompiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
kotlinAndroid = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlinSerialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
`;
  await fs.ensureDir(path.join(outputDir, 'gradle'));
  await fs.writeFile(
    path.join(outputDir, 'gradle', 'libs.versions.toml'),
    libsVersions,
    'utf-8'
  );

  // Shared module
  const composeAppBuildGradle = `import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.kotlinSerialization)
}

kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }

    androidTarget {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_17)
        }
    }

    listOf(iosArm64(), iosSimulatorArm64()).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "ComposeApp"
            isStatic = true
        }
    }

    sourceSets {
        commonMain.dependencies {
            implementation(libs.compose.runtime)
            implementation(libs.compose.foundation)
            implementation(libs.compose.material3)
            implementation(libs.compose.ui)
            implementation(libs.compose.components.resources)
            implementation(libs.navigation3.ui)
            implementation(libs.ktor.client.core)
            implementation(libs.ktor.client.content.negotiation)
            implementation(libs.ktor.serialization.kotlinx.json)
            implementation(libs.kotlinx.coroutines.core)
            implementation(libs.kotlinx.serialization.json)
        }
        androidMain.dependencies {
            implementation(libs.ktor.client.android)
        }
        iosMain.dependencies {
            implementation(libs.ktor.client.darwin)
        }
    }
}

android {
    namespace = "${packageName}"
    compileSdk = libs.versions.android.compileSdk.get().toInt()

    defaultConfig {
        minSdk = libs.versions.android.minSdk.get().toInt()
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

compose.resources {
    packageOfResClass = "app.generated.resources"
}
`;
  await fs.writeFile(
    path.join(outputDir, 'composeApp', 'build.gradle.kts'),
    composeAppBuildGradle,
    'utf-8'
  );

  // Android application module
  const androidAppDir = path.join(outputDir, 'androidApp');
  await fs.ensureDir(androidAppDir);

  const androidBuildGradle = `import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.kotlinAndroid)
    alias(libs.plugins.composeCompiler)
}

android {
    namespace = "${packageName}"
    compileSdk = libs.versions.android.compileSdk.get().toInt()

    defaultConfig {
        applicationId = "${packageName}"
        minSdk = libs.versions.android.minSdk.get().toInt()
        targetSdk = libs.versions.android.targetSdk.get().toInt()
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

dependencies {
    implementation(project(":composeApp"))
    implementation(libs.androidx.activity.compose)
}
`;
  await fs.writeFile(
    path.join(androidAppDir, 'build.gradle.kts'),
    androidBuildGradle,
    'utf-8'
  );

  const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:label="${String(context.appTitle)}"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden|uiMode"
            android:exported="true"
            android:theme="@android:style/Theme.Material.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`;
  const manifestDir = path.join(androidAppDir, 'src', 'main');
  await fs.ensureDir(manifestDir);
  await fs.writeFile(
    path.join(manifestDir, 'AndroidManifest.xml'),
    manifest,
    'utf-8'
  );

  const mainActivity = `package ${packageName}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import core.i18n.AppContextHolder
import core.theme.AppTheme
import navigation.AppNavigation

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        AppContextHolder.context = applicationContext
        enableEdgeToEdge()
        setContent {
            AppTheme {
                AppNavigation()
            }
        }
    }
}
`;
  const kotlinDir = path.join(manifestDir, 'kotlin', ...packageName.split('.'));
  await fs.ensureDir(kotlinDir);
  await fs.writeFile(
    path.join(kotlinDir, 'MainActivity.kt'),
    mainActivity,
    'utf-8'
  );
}

async function generateKmpNativeFiles(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const outputDir = config.outputDir;
  const packageName = config.packageName;
  const appTitle = String(context.appTitle);

  // iOS Compose entry point
  const iosMainDir = path.join(
    outputDir,
    'composeApp',
    'src',
    'iosMain',
    'kotlin'
  );
  await fs.ensureDir(iosMainDir);
  await fs.writeFile(
    path.join(iosMainDir, 'MainViewController.kt'),
    `import androidx.compose.ui.window.ComposeUIViewController
import core.theme.AppTheme
import navigation.AppNavigation

fun MainViewController() = ComposeUIViewController {
    AppTheme {
        AppNavigation()
    }
}
`,
    'utf-8'
  );

  // iOS application shell
  const iosAppDir = path.join(outputDir, 'iosApp');
  const iosContentDir = path.join(iosAppDir, 'iosApp');
  await fs.ensureDir(iosContentDir);

  await fs.writeFile(
    path.join(iosContentDir, 'iOSApp.swift'),
    `import SwiftUI

@main
struct iOSApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .ignoresSafeArea(.all)
        }
    }
}
`,
    'utf-8'
  );

  await fs.writeFile(
    path.join(iosContentDir, 'ContentView.swift'),
    `import SwiftUI
import ComposeApp

struct ContentView: View {
    var body: some View {
        ComposeView()
            .ignoresSafeArea(.keyboard)
    }
}

struct ComposeView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}
`,
    'utf-8'
  );

  await fs.writeFile(
    path.join(iosContentDir, 'Info.plist'),
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>${appTitle}</string>
    <key>CFBundleDisplayName</key>
    <string>${appTitle}</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UILaunchScreen</key>
    <dict/>
</dict>
</plist>
`,
    'utf-8'
  );

  // XcodeGen spec: keeps the iOS project reproducible without a binary pbxproj.
  await fs.writeFile(
    path.join(iosAppDir, 'project.yml'),
    `name: iosApp
options:
  bundleIdPrefix: ${packageName.split('.').slice(0, -1).join('.')}
  deploymentTarget:
    iOS: "16.0"
settings:
  base:
    DEVELOPMENT_TEAM: ""
targets:
  iosApp:
    type: application
    platform: iOS
    sources:
      - path: iosApp
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: ${packageName}
        INFOPLIST_FILE: iosApp/Info.plist
        FRAMEWORK_SEARCH_PATHS: "$(SRCROOT)/../composeApp/build/xcode-frameworks/$(CONFIGURATION)/$(SDK_NAME)"
        OTHER_LDFLAGS: "-framework ComposeApp"
    preBuildScripts:
      - name: Build Kotlin framework
        basedOnDependencyAnalysis: false
        script: |
          cd "$SRCROOT/.."
          ./gradlew :composeApp:embedAndSignAppleFrameworkForXcode
`,
    'utf-8'
  );

  await fs.writeFile(
    path.join(iosAppDir, 'README.md'),
    `# iOS app

The Swift sources are ready, but Xcode needs a project file. Generate one with
[XcodeGen](https://github.com/yonaskolb/XcodeGen):

\`\`\`bash
brew install xcodegen
cd iosApp
xcodegen generate
open iosApp.xcodeproj
\`\`\`

The \`project.yml\` builds the shared Kotlin framework through
\`./gradlew :composeApp:embedAndSignAppleFrameworkForXcode\` before compiling
Swift, so always open the generated workspace from this directory.
`,
    'utf-8'
  );
}

async function generateKmpNavigation(
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

async function generateKmpViewModels(config: ProjectConfig): Promise<void> {
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
