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

  // Step 1: Copy base template (Common code only)
  logger.step(1, 5, 'Copying shared KMP code...');
  await copyTemplateDir(baseDir, config.outputDir, context);

  // Step 2: Generate native files at runtime
  logger.step(2, 5, 'Generating native platform files...');
  await generateKmpNativeFiles(config, context);

  // Step 3: Copy selected screen modules (MVVM)
  logger.step(3, 5, 'Adding selected features...');
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

  // Step 4: Generate navigation graph
  logger.step(4, 5, 'Generating navigation...');
  await generateKmpNavigation(config, context);

  // Step 5: Generate ViewModel registrations
  logger.step(5, 5, 'Setting up ViewModels...');
  await generateKmpViewModels(config, context);
}

async function generateKmpNativeFiles(
  config: ProjectConfig,
  _context: Record<string, unknown>
): Promise<void> {
  const outputDir = config.outputDir;

  // 1. Root Gradle Files
  const buildGradle = `plugins {
    alias(libs.plugins.androidApplication).apply(false)
    alias(libs.plugins.androidLibrary).apply(false)
    alias(libs.plugins.composeMultiplatform).apply(false)
    alias(libs.plugins.composeCompiler).apply(false)
    alias(libs.plugins.kotlinMultiplatform).apply(false)
    alias(libs.plugins.kotlinSerialization).apply(false)
}
`;
  await fs.writeFile(path.join(outputDir, 'build.gradle.kts'), buildGradle);

  const settingsGradle = `rootProject.name = "${config.name}"
include(":composeApp")
include(":androidApp")
`;
  await fs.writeFile(path.join(outputDir, 'settings.gradle.kts'), settingsGradle);

  // 2. Gradle Version Catalog
  const libsVersions = `[versions]
agp = "8.2.2"
android-compileSdk = "34"
android-minSdk = "24"
android-targetSdk = "34"
androidx-activityCompose = "1.8.2"
compose-multiplatform = "1.6.11"
kotlin = "2.0.0"
ktor = "2.3.11"
navigation-compose = "2.8.0-alpha08"

[libraries]
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "androidx-activityCompose" }
ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
ktor-client-android = { module = "io.ktor:ktor-client-android", version.ref = "ktor" }
navigation-compose = { module = "org.jetbrains.androidx.navigation:navigation-compose", version.ref = "navigation-compose" }

[plugins]
androidApplication = { id = "com.android.application", version.ref = "agp" }
androidLibrary = { id = "com.android.library", version.ref = "agp" }
composeMultiplatform = { id = "org.jetbrains.compose", version.ref = "compose-multiplatform" }
composeCompiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
kotlinSerialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
`;
  await fs.ensureDir(path.join(outputDir, 'gradle'));
  await fs.writeFile(path.join(outputDir, 'gradle', 'libs.versions.toml'), libsVersions);

  // 3. androidApp Module
  const androidAppDir = path.join(outputDir, 'androidApp');
  await fs.ensureDir(androidAppDir);
  
  const androidBuildGradle = `plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
}

kotlin {
    androidTarget()
}

android {
    namespace = "${config.packageName}"
    compileSdk = libs.versions.android.compileSdk.get().toInt()

    defaultConfig {
        applicationId = "${config.packageName}"
        minSdk = libs.versions.android.minSdk.get().toInt()
        targetSdk = libs.versions.android.targetSdk.get().toInt()
        versionCode = 1
        versionName = "1.0"
    }
}

dependencies {
    implementation(project(":composeApp"))
    implementation(libs.androidx.activity.compose)
}
`;
  await fs.writeFile(path.join(androidAppDir, 'build.gradle.kts'), androidBuildGradle);

  const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="true"
        android:label="${config.name}"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">
        <activity
            android:name=".MainActivity"
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
  await fs.writeFile(path.join(manifestDir, 'AndroidManifest.xml'), manifest);

  const packagePath = config.packageName.replace(/\./g, '/');
  const mainActivity = `package ${config.packageName}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import navigation.AppNavigation

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppNavigation()
        }
    }
}
`;
  const kotlinDir = path.join(manifestDir, 'kotlin', packagePath);
  await fs.ensureDir(kotlinDir);
  await fs.writeFile(path.join(kotlinDir, 'MainActivity.kt'), mainActivity);

  // 4. iosApp Module (More complete structure)
  const iosAppDir = path.join(outputDir, 'iosApp');
  const iosContentDir = path.join(iosAppDir, 'iosApp');
  await fs.ensureDir(iosContentDir);
  
  const iosAppSwift = `import SwiftUI
import ComposeApp

@main
struct iOSApp: App {
	var body: some Scene {
		WindowGroup {
			ContentView()
		}
	}
}
`;
  await fs.writeFile(path.join(iosContentDir, 'iosApp.swift'), iosAppSwift);

  const contentViewSwift = `import SwiftUI
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
`;
  await fs.writeFile(path.join(iosContentDir, 'ContentView.swift'), contentViewSwift);

  const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
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
	<string>$(PRODUCT_NAME)</string>
	<key>CFBundlePackageType</key>
	<string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0</string>
	<key>CFBundleVersion</key>
	<string>1</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>UIApplicationSceneManifest</key>
	<dict>
		<key>UIApplicationSupportsMultipleScenes</key>
		<false/>
	</dict>
	<key>UILaunchScreen</key>
	<dict/>
	<key>UIRequiredDeviceCapabilities</key>
	<array>
		<string>armv7</string>
	</array>
</dict>
</plist>
`;
  await fs.writeFile(path.join(iosContentDir, 'Info.plist'), infoPlist);

  // 5. Shared MainView Bridges
  const androidMainDir = path.join(outputDir, 'composeApp', 'src', 'androidMain', 'kotlin');
  await fs.ensureDir(androidMainDir);
  await fs.writeFile(path.join(androidMainDir, 'MainView.kt'), `import androidx.compose.runtime.Composable\nimport navigation.AppNavigation\n\n@Composable\nfun MainView() {\n    AppNavigation()\n}\n`);

  const iosMainDir = path.join(outputDir, 'composeApp', 'src', 'iosMain', 'kotlin');
  await fs.ensureDir(iosMainDir);
  await fs.writeFile(path.join(iosMainDir, 'MainViewController.kt'), `import androidx.compose.ui.window.ComposeUIViewController\nimport navigation.AppNavigation\n\nfun MainViewController() = ComposeUIViewController {\n    AppNavigation()\n}\n`);
  
  logger.success('KMP native platform files generated.');
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
  const screens: string[] = [];
  const composables: string[] = [];

  for (const screenId of config.screens) {
    const cases = screenIdToCases(screenId);
    const moduleDir = screenId.replace(/-/g, '');
    imports.push(`import features.${moduleDir}.view.${cases.pascal}Screen`);
    
    screens.push(`@Serializable\nobject ${cases.pascal}`);
    composables.push(`        composable<${cases.pascal}> {\n            ${cases.pascal}Screen()\n        }`);
  }

  // Improved start destination logic
  let startScreenId = config.screens[0] || 'signin';
  if (config.screens.includes('onboarding')) {
    startScreenId = 'onboarding';
  } else if (config.screens.includes('signin')) {
    startScreenId = 'signin';
  }
  
  const startDest = screenIdToCases(startScreenId).pascal;

  const navContent = `package navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import kotlinx.serialization.Serializable
${imports.join('\n')}

// Routes
${screens.join('\n')}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = ${startDest}
    ) {
${composables.join('\n\n')}
    }
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
