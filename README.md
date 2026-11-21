<div align="center">
  <h1>📱 Mobile App Starter Kit</h1>
  <p><strong>Generate production-ready mobile app boilerplate for Expo, Flutter, and Kotlin Multiplatform — in one command.</strong></p>

  <!-- Badges -->

<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT"></a>
<a href="https://www.npmjs.com/package/mobile-app-starter-kit"><img src="https://img.shields.io/npm/v/mobile-app-starter-kit.svg?style=for-the-badge&logo=npm" alt="npm version"></a>
<a href="https://github.com/piashcse/mobile-app-starter-kit/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/piashcse/mobile-app-starter-kit/ci.yml?style=for-the-badge" alt="CI"></a>
<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D22.13-339933.svg?style=for-the-badge&logo=nodedotjs" alt="Node.js Version"></a>

  <br />
  <br />
</div>

## 🌟 Why Mobile App Starter Kit?

Setting up a mobile architecture that scales is time-consuming: navigation, state management, theming, a mock API, auth flows, and native project configuration all have to be wired before you write your first feature.

**Mobile App Starter Kit** gives you a fully configured, buildable app in a single command — with **selectable screens**, a **working mock API**, **light/dark themes**, and **CI-verified templates** for all three frameworks.

✨ **Key features**

- 🧩 **Selectable screens** — include only the screens you need.
- 🎨 **Light/dark themes** — system-aware themes with a working in-app toggle.
- 🔐 **Persisted auth** — secure session restore on launch.
- 🏗️ **Best-practice architecture** — Expo Router + RTK Query, Flutter Clean Architecture + Riverpod, Compose Multiplatform + MVVM.
- 🎭 **Mock API built in** — email/password demo auth with simulated latency.
- 🛠️ **Verified templates** — CI type-checks Expo, analyzes Flutter, and builds the KMP Android app.
- 📦 **Runnable output** — `.gitignore`, README, assets, native projects, and a Gradle wrapper included.

---

## ⚡ Quick Start

```bash
# 1. Interactive mode (recommended)
npx mobile-app-starter-kit init
```

Skip the prompts with flags:

```bash
npx mobile-app-starter-kit init \
  --name "My App" \
  --framework expo \
  --screens signin,signup,profile,faq \
  --package-name com.example.myapp \
  --yes
```

> **Requirements:** Node.js **22.13+**. Flutter, JDK 17+, and Xcode are only required for the framework you generate.

Check your machine first:

```bash
npx mobile-app-starter-kit doctor
```

---

## 🏗️ Supported Frameworks

| Framework      | Versions                         | State                | Navigation         | Theme                          |
| -------------- | -------------------------------- | -------------------- | ------------------ | ------------------------------ |
| ⚛️ **Expo**    | Expo SDK 58 · RN 0.88 · React 19 | RTK Query + Zustand  | Expo Router        | Light/dark + toggle            |
| 💙 **Flutter** | Flutter 3.50 · Dart 3.14         | Riverpod 3           | GoRouter           | Material 3 light/dark + toggle |
| 🚀 **KMP**     | Kotlin 2.4 · Compose MP 1.11     | StateFlow ViewModels | Compose Navigation | Material 3 light/dark          |

---

## 🎨 Design system & localization

Every generated project is driven by one shared contract, so the three platforms cannot drift:

- **Design tokens** — `src/design/tokens.ts` is emitted as:
  - `design-tokens.json` at the project root (for designers/tooling)
  - `src/theme/*` (Expo)
  - `lib/core/theme/*` (Flutter)
  - `core/theme/*` (KMP)
- **Strings** — `src/design/strings.ts` generates:
  - `src/i18n/*` (Expo, `expo-localization`)
  - `lib/core/l10n/*` (Flutter, `flutter_localizations`)
  - `core/i18n/*` (KMP, `CompositionLocal`)

Included out of the box:

- English + Spanish catalogs and a working language switcher on Sign In.
- Per-platform locale persistence (SecureStore/localStorage, SharedPreferences,
  SharedPreferences/NSUserDefaults).
- System-aware light/dark themes with an in-app toggle (persisted on Expo/Flutter).
- Identical palette, type scale, spacing, radii, and component sizing on all three.

The localized Sign In screen is the reference implementation. Add a key to
`src/design/strings.ts` and regenerate to extend localization to more screens.

---

## 📋 Available Screens

| Screen             | ID                | Default | Description                         |
| ------------------ | ----------------- | :-----: | ----------------------------------- |
| Sign In            | `signin`          |   ✅    | Email/password auth with validation |
| Sign Up            | `signup`          |   ✅    | Account creation with validation    |
| Forgot Password    | `forgot-password` |   ✅    | Password reset flow                 |
| Change Password    | `change-password` |   ❌    | In-app password update              |
| Profile            | `profile`         |   ✅    | User profile + sign out             |
| Settings           | `settings`        |   ✅    | Preferences and theme toggle        |
| Onboarding         | `onboarding`      |   ❌    | Swipeable intro slides              |
| FAQ                | `faq`             |   ✅    | Expandable accordion                |
| Privacy Policy     | `privacy-policy`  |   ✅    | Static legal content                |
| Terms & Conditions | `terms`           |   ❌    | Terms layout                        |
| Notifications      | `notifications`   |   ❌    | Read/unread notification list       |
| About              | `about`           |   ❌    | App version and links               |

```bash
# Omit default screens
npx mobile-app-starter-kit init --skip faq,privacy-policy

# List screens or frameworks (add --json for tooling)
npx mobile-app-starter-kit list screens
npx mobile-app-starter-kit list frameworks --json
```

---

## 🔧 CLI Reference

### `init` (alias: `create`)

| Flag             | Short | Description                                             |
| ---------------- | ----- | ------------------------------------------------------- |
| `--name`         | `-n`  | Project name (spaces, hyphens, camelCase all supported) |
| `--framework`    | `-f`  | `expo`, `flutter`, or `kmp`                             |
| `--screens`      | `-s`  | Comma-separated screens to include                      |
| `--skip`         |       | Comma-separated default screens to omit                 |
| `--package-name` | `-p`  | Bundle identifier (defaults to `com.example.<name>`)    |
| `--output`       | `-o`  | Output directory (defaults to `./<kebab-name>`)         |
| `--yes`          | `-y`  | Non-interactive mode with defaults                      |
| `--force`        |       | Replace a non-empty output directory                    |
| `--no-install`   |       | Skip `npm install` / `flutter pub get`                  |
| `--no-git`       |       | Skip `git init`                                         |
| `--dry-run`      |       | Print the resolved configuration only                   |
| `--verbose`      |       | Stream install output                                   |

Names are normalised automatically:

| Input         | Folder        | Package                 | Dart package  |
| ------------- | ------------- | ----------------------- | ------------- |
| `My Cool App` | `my-cool-app` | `com.example.mycoolapp` | `my_cool_app` |

### `add`

Add screens to an existing generated project (framework auto-detected):

```bash
cd my-app
npx mobile-app-starter-kit add --screen notifications,about
```

### `list`

```bash
npx mobile-app-starter-kit list screens
npx mobile-app-starter-kit list frameworks
```

> The package also installs a shorter `mask` binary, e.g. `npx mask init`.

### `doctor`

Verifies Node, npm, git, Flutter, Java, Xcode, and the Android SDK.

---

## 📁 Generated structure

<details>
<summary><b>⚛️ Expo</b></summary>

```
my-app/
├── app/                    # Expo Router routes
│   ├── (auth)/
│   └── (main)/
├── src/
│   ├── api/                # RTK Query mock API
│   ├── components/         # Themed UI primitives
│   ├── features/           # Screen implementations
│   ├── store/              # Zustand auth (SecureStore-backed)
│   └── theme/              # Light/dark palettes + ThemeProvider
├── assets/images/          # App icon + splash assets
├── .gitignore
└── README.md
```

</details>

<details>
<summary><b>💙 Flutter</b></summary>

```
my-app/
├── lib/
│   ├── core/
│   │   ├── api/            # Dio client + mock interceptor
│   │   ├── auth/           # Persisted auth state
│   │   ├── theme/          # Material 3 themes + mode provider
│   │   ├── widgets/        # AppButton/AppInput/AppCard
│   │   └── router/         # GoRouter configuration
│   └── features/
│       └── signin/
│           ├── data/
│           └── presentation/
├── android/                # applicationId matches --package-name
├── ios/                    # bundle id matches --package-name
└── README.md
```

</details>

<details>
<summary><b>🚀 Kotlin Multiplatform</b></summary>

```
my-app/
├── composeApp/src/
│   ├── commonMain/kotlin/
│   │   ├── core/           # Theme, components, API, ViewModel base
│   │   ├── features/       # MVVM feature modules
│   │   ├── navigation/     # Type-safe Compose Navigation
│   │   └── di/             # ViewModel factories
│   └── iosMain/kotlin/     # Compose UIViewController
├── androidApp/             # Android entry point
├── iosApp/                 # Swift app + XcodeGen project.yml
├── gradle/wrapper/         # Gradle wrapper (included)
└── README.md
```

</details>

---

## 🧩 Mock API

All frameworks ship with the same demo credentials:

- **Email:** `test@example.com`
- **Password:** `password`

The mock layer simulates ~800 ms of latency so loading states are visible.

| Framework | Location                               | Replace with                      |
| --------- | -------------------------------------- | --------------------------------- |
| Expo      | `src/api/apiSlice.ts` + `mockData.ts`  | `fetchBaseQuery` against your API |
| Flutter   | `lib/core/api/mock_interceptor.dart`   | Remove interceptor, set `baseUrl` |
| KMP       | `composeApp/.../core/api/ApiClient.kt` | Ktor `HttpClient` calls           |

---

## ✅ Verification performed by CI

Every pull request:

1. Builds the TypeScript CLI and runs unit + generation tests.
2. Generates a project for each framework.
3. Runs `tsc --noEmit` and `expo prebuild` for Expo.
4. Runs `flutter pub get` and `flutter analyze` for Flutter.
5. Runs `./gradlew :androidApp:assembleDebug` for KMP.

---

## 🤝 Contributing

Contributions are welcome! Read [CONTRIBUTING.md](CONTRIBUTING.md), fork the repo, and open a pull request.

If you find a bug or have a feature request, please [open an issue](https://github.com/piashcse/mobile-app-starter-kit/issues).

---

## 👨‍💻 Author

<a href="https://twitter.com/piashcse" target="_blank">
  <img src="https://avatars.githubusercontent.com/piashcse" width="80" align="left">
</a>

**Mehedi Hassan Piash**

[![Twitter](https://img.shields.io/badge/-Twitter-1DA1F2?logo=x&logoColor=white&style=for-the-badge)](https://twitter.com/piashcse)
[![Medium](https://img.shields.io/badge/-Medium-00AB6C?logo=medium&logoColor=white&style=for-the-badge)](https://medium.com/@piashcse)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?logo=linkedin&logoColor=white&style=for-the-badge)](https://www.linkedin.com/in/piashcse/)
[![Web](https://img.shields.io/badge/-Web-0073E6?logo=appveyor&logoColor=white&style=for-the-badge)](https://piashcse.github.io/)

## License

MIT — see [LICENSE](LICENSE).
