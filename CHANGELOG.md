# Changelog

All notable changes to this project are documented here.

## 2.0.0 — 2026-11-21

First release since `1.0.2`. This release makes every generated template
buildable and CI-verified, and establishes the shared architecture used by the
Expo, Flutter, and KMP starters.

### Added

- Shared design-token contract (`src/design/tokens.ts`) emitted as
  `design-tokens.json` plus platform theme files for Expo, Flutter, and KMP.
- Canonical light/dark palette, type scale, spacing, radii, and component sizing
  generated identically for all three platforms.
- Shared string catalog (`src/design/strings.ts`) with English + Spanish,
  powering localization on all three platforms.
- Expo i18n provider (`expo-localization`), Flutter `AppLocalizations` +
  locale provider, and KMP `Strings` + platform locale stores.
- Working language switcher and localized, accessibility-labelled Sign In
  screen on every platform.
- Full KMP UI localization: every screen (auth, settings, profile, FAQ,
  notifications, onboarding, about, legal) uses Compose Multiplatform resources
  (`composeResources/values*/strings.xml` + `stringResource`).
- Official runtime locale override (`LocalAppLocale` + `CompositionLocal` and
  `key(locale)`) so the language switcher updates resources on Android and iOS.
- Typed KMP error model (`AppError` / `ValidationReason`) with validation moved
  into ViewModels and localized only at the presentation boundary.
- KMP change-password now has a real ViewModel with validation and API wiring.
- Working light/dark themes with an in-app toggle (persisted on Expo/Flutter).
- Persisted auth sessions (Expo SecureStore, Flutter SharedPreferences).
- **Navigation 3** for KMP (`org.jetbrains.androidx.navigation3`) with a
  user-owned `NavBackStack`, `NavDisplay`, and serializable `NavKey` routes.
- iOS XcodeGen project spec for KMP.
- Generated `.gitignore`, project README, app icon/splash assets, and Gradle
  wrapper for generated projects.
- `doctor` command for environment checks (Node, Flutter, Java, Xcode, Android SDK).
- Working `add` command for Expo, Flutter, and KMP projects.
- `list --json` for tooling and scripts.
- Non-interactive and DX flags: `--yes`, `--force`, `--no-install`, `--no-git`,
  `--dry-run`, `--verbose`.
- Generation tests and generated-project assertions (`vitest`).
- Generated unit tests: Flutter localization tests and KMP validator tests.
- Expo projects include ESLint (`npm run lint`) and strict unused checks.
- Flutter uses a typed `UserProfile` model, a shared `apiClientProvider`, and
  `--dart-define` configuration (`USE_MOCK_API`, `API_BASE_URL`).
- Removed non-functional profile actions and replaced empty Flutter catch
  blocks with validated submissions and visible errors.
- Split large CLI generators into focused modules for maintainability.
- Strict TypeScript checks (`noUnusedLocals`, `noUnusedParameters`,
  `noImplicitReturns`) and a root `.editorconfig`.
- SECURITY.md, CODE_OF_CONDUCT.md, issue/PR templates, Dependabot, and an npm
  publish workflow with provenance.

### Changed

- Minimum Node.js is now 22.13.
- CLI dependencies updated (Commander 15, Inquirer 14, Ora 10, Chalk 6);
  `glob` removed and runtime `typescript` moved to devDependencies.
- Expo template upgraded to SDK 58 (React Native 0.88, React 19).
- Flutter template upgraded to Flutter 3.50-era dependencies (GoRouter 18,
  Riverpod 3) and system typography (removed `google_fonts`).
- KMP template upgraded to Kotlin 2.4, Compose Multiplatform 1.11, Ktor 3.6,
  and Navigation 3 `1.1.2`.
- Navigation 3 is pinned to `1.1.2`, the latest release compatible with the
  generated AGP 8.13 / compileSdk 36 toolchain. Navigation 3 `1.2.x` requires
  AGP 9.1+ and compileSdk 37.
- KMP uses iOS arm64 + simulator arm64 targets (Compose MP no longer publishes
  iosX64 artifacts).
- CI now builds, tests, and verifies generated Expo, Flutter, and KMP projects.
- README, CONTRIBUTING, license year, package metadata, and repository URLs.

### Fixed

- Expo projects are now buildable: added `expo-linear-gradient`,
  `expo-secure-store`, `expo-system-ui`, and `expo-localization`, plus missing
  image assets.
- Removed invalid `headerBackTitleVisible` navigation option.
- Fixed `SigninScreen`/`SignupScreen` casing so generated routes resolve.
- Fixed Flutter compile errors (`AppColors.accentLight`, Riverpod 3 controllers)
  and invalid Dart package names.
- Flutter Android/iOS identifiers now exactly match `--package-name`.
- KMP projects build with an included Gradle wrapper, complete version catalog,
  serialization + Android plugins, repositories, and wired navigation.
- KMP primary buttons now use the shared gradient and correct `onPrimary`
  contrast; safe-area insets are applied at the navigation root.
- Package names containing Java/Kotlin keywords (e.g. `final`) are sanitized or
  rejected.
- Screens no longer link to screens that were not generated.
- About screens render the real project name instead of `{{projectName}}`.
- Removed committed Gradle caches and stopped copying build caches into projects.
- Interactive input validation, duplicate screen de-duplication, and shell-safe
  toolchain invocations.
- CLI `--version` now reads the real package version.
- Non-empty output directories fail clearly unless `--force` is passed.
- Failed generations clean up partial output.
