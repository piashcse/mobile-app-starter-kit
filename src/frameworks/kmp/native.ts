import path from 'path';
import fs from 'fs-extra';
import type { ProjectConfig } from '../../config.js';

export async function generateKmpNativeFiles(
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

@Suppress("ktlint:standard:function-naming")
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
