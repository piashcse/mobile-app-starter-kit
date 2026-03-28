import { SCREENS, FRAMEWORKS, type Framework } from '../config.js';

export function validateFramework(framework: string): framework is Framework {
  return FRAMEWORKS.some((f) => f.id === framework);
}

export function validateScreens(screens: string[]): { valid: string[]; invalid: string[] } {
  const validIds = SCREENS.map((s) => s.id);
  const valid = screens.filter((s) => validIds.includes(s));
  const invalid = screens.filter((s) => !validIds.includes(s));
  return { valid, invalid };
}

export function validatePackageName(packageName: string): boolean {
  // Must match: com.example.appname
  return /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){1,}$/.test(packageName);
}

export function validateProjectName(name: string): boolean {
  return name.length > 0 && name.length <= 50 && /^[a-zA-Z][a-zA-Z0-9 _-]*$/.test(name);
}
