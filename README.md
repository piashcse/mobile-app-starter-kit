<div align="center">
  <h1>📱 Mobile App Starter Kit</h1>
  <p><strong>A powerful CLI tool to generate production-ready mobile app boilerplate for Expo, Flutter, and Kotlin Multiplatform (KMP).</strong></p>

  <!-- Badges -->
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/mobile-app-starter-kit"><img src="https://img.shields.io/npm/v/mobile-app-starter-kit.svg?style=for-the-badge&logo=npm" alt="npm version"></a>
  <a href="https://github.com/your-username/mobile-app-starter-kit/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D_18-339933.svg?style=for-the-badge&logo=nodedotjs" alt="Node.js Version"></a>

  <br />
  <br />
</div>

## 🌟 Why Mobile App Starter Kit?

Setting up a mobile architecture that scales is incredibly time-consuming. You have to configure navigation, state management, UI libraries, mock APIs, and authentication flows before you even start writing your first business feature.

**Mobile App Starter Kit** solves this by letting you run a single CLI command to spin up a fully configured, feature-rich app in your favorite framework.

✨ **Key Features:**
- 🧩 **Selectable Screens:** Choose exactly what you need (Auth flow, Profile, Settings, FAQ, etc.).
- 🎨 **Premium UI/UX:** Built-in design system, dark mode matching, and beautifully crafted reusable UI components.
- 🏗️ **Best-Practice Architecture:** Adheres to the latest community standards for each framework.
- 🎭 **Mock API Native:** Comes wired up with a simulated local backend so you can start building UI instantly.
- 🛠️ **Multi-Framework:** Generates perfect templates for **Expo React Native**, **Flutter**, and **Compose Multiplatform (KMP)**.

---

## ⚡ Quick Start

You don't need to install anything globally. Just use `npx`:

```bash
# 1. Interactive mode (Recommended)
npx mobile-app-starter-kit init
```

*Want to skip the prompts? Use flags!*

```bash
# 2. One-liner with flags
npx mobile-app-starter-kit init \
  --name "MyApp" \
  --framework expo \
  --screens signin,signup,profile,faq \
  --package-name com.example.myapp
```

---

## 🏗️ Supported Frameworks & Architecture

This tool generates highly opinionated, community-standard architectures depending on your framework of choice:

| Framework | State Management | API Layer | Navigation | Arch. Pattern |
|-----------|-----------------|-----------|------------|--------------|
| ⚛️ **Expo** | RTK Query + Zustand | RTK Query | Expo Router | Feature-based |
| 💙 **Flutter**| Riverpod | Dio + Mock Interceptor | GoRouter | Clean Architecture |
| 🚀 **KMP** | ViewModel + StateFlow | Ktor Mock Engine | Compose Navigation | MVVM |

---

## 📋 Available Screens

All generated screens are fully responsive and wired to the mock API state.

| Screen | Identifier | Included by Default | Description |
|--------|------------|:-------------------:|-------------|
| **Sign In** | `signin` | ✅ | Email/password auth, loading states, validation. |
| **Sign Up** | `signup` | ✅ | Account creation with form validation. |
| **Forgot Password** | `forgot-password`| ✅ | Reset password flow. |
| **Change Password** | `change-password`| ❌ | In-app secure password update. |
| **Profile** | `profile` | ✅ | User profile view and details. |
| **Settings** | `settings` | ✅ | App preferences, dark mode toggles, navigation. |
| **Onboarding** | `onboarding` | ❌ | Swipeable interactive intro slides. |
| **FAQ** | `faq` | ✅ | Expandable/collapsible interactive accordion list. |
| **Privacy Policy** | `privacy-policy` | ✅ | Static dynamic text screen. |
| **Terms & Cond.** | `terms` | ❌ | Terms of service layout. |
| **Notifications** | `notifications` | ❌ | List of notifications with unread/read indicators. |
| **About** | `about` | ❌ | App versioning and direct links. |

> **Pro Tip:** Use `--skip` parameter to omit default screens, e.g., `--skip faq,privacy-policy`.

---

## 📁 What does the generated code look like?

<details>
<summary><b>⚛️ View Expo Structure</b></summary>

\`\`\`
my-app/
├── app/                    # Expo Router file-based routes
│   ├── (auth)/            # Auth screens group
│   └── (main)/            # Main screens group
├── src/
│   ├── api/               # RTK Query API slices + mock data
│   ├── components/        # Reusable UI (AppButton, AppInput)
│   ├── features/          # Screen ui and local components
│   ├── store/             # Global Zustand auth store
│   └── theme/             # Design Tokens (colors, typography)
└── package.json
\`\`\`
</details>

<details>
<summary><b>💙 View Flutter Structure</b></summary>

\`\`\`
my-app/
├── lib/
│   ├── core/
│   │   ├── api/           # Dio client + mock interceptor
│   │   ├── theme/         # AppColors, AppTheme
│   │   ├── widgets/       # Reusable components
│   │   └── router/        # GoRouter configuration
│   └── features/
│       └── signin/        # Modular Clean Architecture
│           ├── data/      #   Repositories
│           ├── domain/    #   Use Cases
│           └── presentation/ # UI + Riverpod Controllers
└── pubspec.yaml
\`\`\`
</details>

<details>
<summary><b>🚀 View KMP Structure</b></summary>

\`\`\`
my-app/
├── composeApp/src/commonMain/kotlin/
│   ├── core/
│   │   ├── api/           # Ktor client + explicit Result wrapper
│   │   ├── components/    # Reusable composables
│   │   ├── theme/         # Material 3 typography and dark colors
│   │   └── viewmodel/     # Base ViewModel + typed UiState
│   ├── features/
│   │   └── signin/        # MVVM separation
│   │       ├── model/     
│   │       ├── viewmodel/ #   StateFlow VM
│   │       └── view/      
│   ├── navigation/        # Compose Navigation / NavHost
│   └── di/                # Lightweight manual dependency injection
└── build.gradle.kts
\`\`\`
</details>

---

## 🧩 The Mock API Layer

All three frameworks are generated using a consistent mock API configuration.

**Test Credentials for generated apps:**
- **Email:** `test@example.com`
- **Password:** `password`

The API simulates network latency (approx ~800ms) to ensure your loading states and shimmer effects look perfect. When your backend is ready, just delete the `MockInterceptor` or `MockData` file and point the base URL to your staging API!

---

## 🔧 CLI Reference

### `init`
Generates a new project.
| Flag | Short | Description |
|------|-------|-------------|
| `--name` | `-n` | Project name (camelCase/kebab-case supported) |
| `--framework`| `-f` | Framework choice: `expo`, `flutter`, `kmp` |
| `--screens` | `-s` | Comma-separated screen IDs to explicitly include |
| `--skip` | | Comma-separated screen IDs to omit |
| `--package-name`|`-p` | Bundle identifier (e.g., `com.example.app`) |
| `--output` | `-o` | Specific output directory |

### `list`
Shows available options.
```bash
npx mobile-app-starter-kit list screens
npx mobile-app-starter-kit list frameworks
```

---

## 🤝 Contributing & Community

We'd love your help making this tool even better! Whether it's adding a new framework (like React Native Bare or SwiftUI), adding new screen templates, or improving the architecture:

1. Read our [**Contributing Guidelines**](CONTRIBUTING.md) to get started.
2. Fork the repository.
3. Make your changes and open a Pull Request!

If you spot a bug or have a feature request, please open an issue!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <br/>
  <i>Built with ❤️ for Mobile Developers</i>
</div>
