# 📱 Mobile App Starter Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/mobile-app-starter-kit.svg)](https://www.npmjs.com/package/mobile-app-starter-kit)

> **Generate production-ready mobile app boilerplate** for **Expo React Native**, **Flutter**, and **KMP (Kotlin Multiplatform)** — with configurable screens, mock API, and best-practice architecture.

---

## ⚡ Quick Start

```bash
# Interactive mode
npx mobile-app-starter-kit init

# One-liner with flags
npx mobile-app-starter-kit init --name MyApp --framework expo --screens signin,signup,profile,faq
```

## 🎯 What You Get

One command generates a **fully scaffolded mobile app** with:

- ✅ Selected screens (auth, profile, settings, etc.)
- ✅ Mock API layer (hardcoded JSON — ready to swap for real APIs)
- ✅ Navigation (Expo Router / GoRouter / Voyager)
- ✅ State management (RTK Query + Zustand / Riverpod / MVVM)
- ✅ Theming (dark mode, premium color system)
- ✅ Reusable components (Button, Input, Card, etc.)
- ✅ Clean project architecture

---

## 🏗️ Architecture

| Framework | State Management | API Layer | Navigation | Architecture |
|-----------|-----------------|-----------|------------|--------------|
| **Expo React Native** | RTK Query + Zustand | RTK Query (createApi) | Expo Router | Feature-based |
| **Flutter** | Riverpod | Dio + Mock Interceptor | GoRouter | Clean Architecture |
| **KMP** | ViewModel + StateFlow | Ktor Mock Engine | Voyager | MVVM |

---

## 📋 Available Screens

| Screen | ID | Default |
|--------|-----|---------|
| Sign In | `signin` | ✅ |
| Sign Up | `signup` | ✅ |
| Forgot Password | `forgot-password` | ✅ |
| Change Password | `change-password` | ○ |
| Profile | `profile` | ✅ |
| Settings | `settings` | ✅ |
| Onboarding | `onboarding` | ○ |
| FAQ | `faq` | ✅ |
| Privacy Policy | `privacy-policy` | ✅ |
| Terms & Conditions | `terms` | ○ |
| Notifications | `notifications` | ○ |
| About | `about` | ○ |

---

## 🔧 CLI Commands

### `init` — Generate a new project

```bash
# Interactive (prompts for everything)
npx mobile-app-starter-kit init

# With flags
npx mobile-app-starter-kit init \
  --name "MyApp" \
  --framework expo \
  --screens signin,signup,profile,faq \
  --package-name com.example.myapp

# Skip specific screens from defaults
npx mobile-app-starter-kit init \
  --name "MyApp" \
  --framework flutter \
  --skip onboarding,terms
```

### `list` — Show available options

```bash
npx mobile-app-starter-kit list screens
npx mobile-app-starter-kit list frameworks
```

### Options

| Flag | Description |
|------|-------------|
| `-n, --name` | Project name |
| `-f, --framework` | `expo`, `flutter`, or `kmp` |
| `-s, --screens` | Comma-separated screen IDs to include |
| `--skip` | Comma-separated screen IDs to exclude |
| `-p, --package-name` | Bundle/package identifier |
| `-o, --output` | Output directory path |

---

## 📁 Generated Project Structure

### Expo React Native
```
my-app/
├── app/                    # Expo Router file-based routes
│   ├── (auth)/            # Auth screens group
│   └── (main)/            # Main screens group
├── src/
│   ├── api/               # RTK Query API slice + mock data
│   ├── components/        # Reusable UI components
│   ├── features/          # Screen features
│   ├── store/             # Redux store + Zustand stores
│   └── theme/             # Colors, typography, spacing
└── package.json
```

### Flutter (Clean Architecture)
```
my-app/
├── lib/
│   ├── core/
│   │   ├── api/           # Dio client + mock interceptor
│   │   ├── theme/         # AppColors, AppTheme
│   │   ├── widgets/       # Reusable widgets
│   │   └── router/        # GoRouter config
│   └── features/
│       └── signin/        # Each feature follows:
│           ├── data/      #   Repository + data sources
│           ├── domain/    #   Entities + use cases
│           └── presentation/ # Screen + controller
└── pubspec.yaml
```

### KMP (MVVM)
```
my-app/
├── composeApp/src/commonMain/kotlin/
│   ├── core/
│   │   ├── api/           # Ktor client + mock data
│   │   ├── components/    # Reusable composables
│   │   ├── theme/         # Material 3 theme
│   │   └── viewmodel/     # Base ViewModel + UiState
│   ├── features/
│   │   └── signin/        # Each feature follows:
│   │       ├── model/     #   Data classes
│   │       ├── viewmodel/ #   ViewModel + StateFlow
│   │       └── view/      #   Composable screen
│   ├── navigation/        # Voyager navigation
│   └── di/                # Dependency injection
└── build.gradle.kts
```

---

## 🧩 Mock API

All frameworks use the same mock API data, making it easy to compare implementations and swap for a real backend:

```
Demo credentials: test@example.com / password
```

Simply replace the mock layer with your real API client when ready:
- **Expo**: Replace `fakeBaseQuery()` in `apiSlice.ts` with `fetchBaseQuery({ baseUrl: 'your-api' })`
- **Flutter**: Remove `MockInterceptor` from `ApiClient` and point to real base URL
- **KMP**: Replace mock `ApiClient` methods with real Ktor HTTP calls

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
