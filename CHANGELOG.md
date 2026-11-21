# Changelog

All notable changes to this project are documented here.

## 2.1.0 — 2026-11-21

### Added

- Shared design-token contract (`src/design/tokens.ts`) emitted as
  `design-tokens.json` plus platform theme files for Expo, Flutter, and KMP.
- Shared string catalog (`src/design/strings.ts`) with English + Spanish,
  powering localization on all three platforms.
- Expo i18n provider (`expo-localization`), Flutter `AppLocalizations` +
  locale provider, and KMP `Strings` + platform locale stores.
- Working language switcher in the generated Sign In screen on every platform.
- Localized, accessibility-labelled Sign In vertical slice (validation, labels,
  buttons, password visibility, demo hint).
- Design-token parity and localization assertions in tests.

### Changed

- Canonical light palette unified across platforms; Expo light theme no longer
  diverges from Flutter/KMP.
- All three platforms use the same type scale, spacing, radii, and component
  sizing from generated tokens.
- KMP primary button now uses the shared gradient and `onPrimary`; app surface
  and safe-area insets are applied at the navigation root.
- Flutter now uses system typography (removed `google_fonts`), matching Expo/KMP.
- KMP uses iOS arm64 + simulator arm64 targets (Compose MP no longer publishes
  iosX64 artifacts).

## 2.0.0 — 2026-11-21

### Added

- Non-interactive and DX flags: `--yes`, `--force`, `--no-install`, `--no-git`,
  `--dry-run`, `--verbose`.
- `doctor` command for environment checks (Node, Flutter, Java, Xcode, Android SDK).
- Working `add` command for Expo, Flutter, and KMP projects.
- `list --json` for tooling and scripts.
- Generation tests and generated-project assertions (`vitest`).
- CI now builds, tests, and verifies generated Expo, Flutter, and KMP projects.
- Generated `.gitignore`, README, app icon/splash assets, and Gradle wrapper.
- Persisted auth sessions (Expo SecureStore, Flutter SharedPreferences).
- Real light/dark themes with an in-app toggle (Expo, Flutter, KMP).
- KMP iOS XcodeGen project spec.
- SECURITY.md, CODE_OF_CONDUCT.md, issue/PR templates, Dependabot.

### Fixed

- Expo projects are now buildable: added `expo-linear-gradient`,
  `expo-secure-store`, and `expo-system-ui`; added missing image assets.
- Removed invalid `headerBackTitleVisible` navigation option.
- Fixed `SigninScreen`/`SignupScreen` casing so generated routes resolve.
- Fixed Flutter compile errors (`AppColors.accentLight`, Riverpod 3 controllers).
- Flutter `pubspec.yaml` now uses a valid Dart package name.
- Flutter Android/iOS identifiers now exactly match `--package-name`.
- KMP projects build with an included Gradle wrapper, complete version catalog,
  serialization + Android plugins, repositories, and wired navigation.
- Package names containing Java/Kotlin keywords (e.g. `final`) are sanitized or rejected.
- Screens no longer link to screens that were not generated.
- About screens render the real project name instead of `{{projectName}}`.
- Removed committed Gradle caches and stopped copying build caches into projects.
- Interactive input validation, duplicate screen de-duplication, and shell-safe
  toolchain invocations.
- CLI `--version` now reads the real package version.
- Non-empty output directories fail clearly unless `--force` is passed.
- Failed generations clean up partial output.

### Changed

- Minimum Node.js is now 22.13.
- CLI dependencies updated (Commander 15, Inquirer 14, Ora 10, Chalk 6)
  and `glob` removed; runtime `typescript` moved to devDependencies.
- Expo template upgraded to SDK 58 (React Native 0.88, React 19).
- Flutter template upgraded to Flutter 3.50-era dependencies (GoRouter 18,
  Riverpod 3).
- KMP template upgraded to Kotlin 2.4, Compose Multiplatform 1.11,
  Ktor 3.6, and Compose Navigation 2.9.
- README, CONTRIBUTING, license year, package metadata, and repository URLs.
