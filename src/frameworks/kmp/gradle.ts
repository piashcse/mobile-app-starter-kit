import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from '../../config.js';

const KOTLIN_VERSION = '2.4.21';
const COMPOSE_VERSION = '1.12.2';
const AGP_VERSION = '9.5.2';
const KTOR_VERSION = '3.6.1';
const NAVIGATION_VERSION = '1.2.0';
const COROUTINES_VERSION = '1.11.0';
const SERIALIZATION_VERSION = '1.13.0';
const ACTIVITY_COMPOSE_VERSION = '1.13.0';
const COMPILE_SDK = '37';
const MIN_SDK = '24';
const TARGET_SDK = '37';

export async function generateKmpBuildFiles(
  config: ProjectConfig,
  context: Record<string, unknown>
): Promise<void> {
  const outputDir = config.outputDir;
  const projectName = String(context.projectName);
  const packageName = config.packageName;

  const rootBuildGradle = `plugins {
    alias(libs.plugins.androidApplication) apply false
    alias(libs.plugins.composeMultiplatform) apply false
    alias(libs.plugins.composeCompiler) apply false
    alias(libs.plugins.kotlinMultiplatform) apply false
    alias(libs.plugins.androidMultiplatformLibrary) apply false
    alias(libs.plugins.kotlinSerialization) apply false
    alias(libs.plugins.ktlint) apply false
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
composeMultiplatform = { id = "org.jetbrains.compose", version.ref = "compose-multiplatform" }
composeCompiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
androidMultiplatformLibrary = { id = "com.android.kotlin.multiplatform.library", version.ref = "agp" }
kotlinSerialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
ktlint = { id = "org.jlleitschuh.gradle.ktlint", version = "14.2.0" }
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
    alias(libs.plugins.androidMultiplatformLibrary)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.kotlinSerialization)
    alias(libs.plugins.ktlint)
}

ktlint {
    filter {
        exclude { it.file.path.contains("generated") }
    }
}

kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }

    android {
        namespace = "${packageName}.shared"
        compileSdk = libs.versions.android.compileSdk
            .get()
            .toInt()
        minSdk = libs.versions.android.minSdk
            .get()
            .toInt()

        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_17)
        }

        androidResources {
            enable = true
        }

        withHostTest {}
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
        commonTest.dependencies {
            implementation(kotlin("test"))
        }
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
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.ktlint)
}

ktlint {
    filter {
        exclude { it.file.path.contains("generated") }
    }
}

android {
    namespace = "${packageName}"
    compileSdk = libs.versions.android.compileSdk
        .get()
        .toInt()

    defaultConfig {
        applicationId = "${packageName}"
        minSdk = libs.versions.android.minSdk
            .get()
            .toInt()
        targetSdk = libs.versions.android.targetSdk
            .get()
            .toInt()
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
