import {
  ALL_SCREEN_IDS,
  FRAMEWORKS,
  SCREENS,
  type Framework,
} from '../config.js';
import { isReservedPackageSegment } from './file.js';

export function validateFramework(framework: string): framework is Framework {
  return FRAMEWORKS.some((f) => f.id === framework);
}

export function validateScreens(screens: string[]): {
  valid: string[];
  invalid: string[];
} {
  const validIds = new Set(ALL_SCREEN_IDS);
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const screen of screens) {
    if (!validIds.has(screen)) {
      invalid.push(screen);
      continue;
    }
    if (seen.has(screen)) continue;
    seen.add(screen);
    valid.push(screen);
  }

  return { valid, invalid };
}

/** Parse a comma-separated screen list, trimming and de-duplicating. */
export function parseScreenList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function validatePackageName(packageName: string): boolean {
  // Must match: com.example.appname
  if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){1,}$/.test(packageName)) {
    return false;
  }
  return packageName
    .split('.')
    .every((segment) => !isReservedPackageSegment(segment));
}

export function validateProjectName(name: string): boolean {
  return (
    name.trim().length > 0 &&
    name.length <= 50 &&
    /^[a-zA-Z][a-zA-Z0-9 _-]*$/.test(name)
  );
}

export function screenName(id: string): string {
  return SCREENS.find((screen) => screen.id === id)?.name ?? id;
}
