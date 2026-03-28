# Contributing to Mobile App Starter Kit

Thank you for your interest in contributing! 🎉

## How to Contribute

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/mobile-app-starter-kit.git
cd mobile-app-starter-kit
npm install
```

### 2. Development

```bash
# Run CLI in development mode
npm run dev -- init --name TestApp --framework expo

# Build
npm run build

# Test the built CLI
npm start -- list screens
```

### 3. Project Structure

```
src/                    # CLI source code (TypeScript)
├── index.ts           # Entry point
├── cli.ts             # Commander.js setup
├── config.ts          # Screen & framework configs
├── generator.ts       # Core generation engine
├── commands/          # CLI commands (init, list, add)
├── frameworks/        # Framework-specific generators
└── utils/             # Helpers (file, logger, validator)

templates/             # Boilerplate templates
├── expo/             # Expo React Native templates
├── flutter/          # Flutter templates
└── kmp/              # KMP templates
```

### 4. Adding a New Screen

1. Add the screen config to `src/config.ts`
2. Create template files in `templates/<framework>/screens/<screen-id>/`
3. Update the framework generator in `src/frameworks/<framework>.ts` if needed
4. Test: `npm run dev -- init --name Test --framework expo --screens your-new-screen`

### 5. Adding a New Framework

1. Add to `FRAMEWORKS` in `src/config.ts`
2. Create `src/frameworks/<framework>.ts`
3. Create `templates/<framework>/base/` and `templates/<framework>/screens/`
4. Import in `src/generator.ts`

## Code Style

- TypeScript strict mode
- Use async/await
- Follow existing patterns

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit with clear messages
3. Push and open a PR
4. Describe what you changed and why

## Adding Templates

When adding new templates:
- Use `.hbs` extension for files needing dynamic values
- Available template variables: `{{projectName}}`, `{{packageName}}`, `{{packagePath}}`
- Follow the architecture patterns of each framework

## Questions?

Open an issue and we'll help you get started!
