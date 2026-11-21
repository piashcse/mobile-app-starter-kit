import { describe, expect, it } from 'vitest';
import {
  catalogs,
  supportedLocales,
  translate,
} from '../src/design/strings.js';
import {
  componentTokens,
  darkColors,
  lightColors,
  radii,
  spacing,
} from '../src/design/tokens.js';

describe('design tokens', () => {
  it('defines the canonical brand and surfaces', () => {
    expect(lightColors.primary).toBe('#6366F1');
    expect(darkColors.primary).toBe('#6366F1');
    expect(darkColors.background).toBe('#0F172A');
    expect(lightColors.background).toBe('#F8FAFC');
    expect(lightColors.onPrimary).toBe('#FFFFFF');
    expect(lightColors.error).toBe('#EF4444');
  });

  it('uses the shared 4pt spacing scale and radii', () => {
    expect(spacing).toEqual({ xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 });
    expect(radii).toEqual({ sm: 8, md: 12, lg: 16, xl: 24 });
    expect(componentTokens.buttonHeight).toBe(52);
    expect(componentTokens.screenPadding).toBe(24);
  });
});

describe('localization catalogs', () => {
  it('supports English and Spanish', () => {
    expect(supportedLocales.map((locale) => locale.code)).toEqual(['en', 'es']);
  });

  it('keeps every locale in sync with the English key set', () => {
    const englishKeys = Object.keys(catalogs.en).sort();
    for (const { code } of supportedLocales) {
      expect(Object.keys(catalogs[code]).sort()).toEqual(englishKeys);
    }
  });

  it('has no empty translations', () => {
    for (const { code } of supportedLocales) {
      for (const [key, value] of Object.entries(catalogs[code])) {
        expect(value.trim(), `${code}:${key}`).not.toBe('');
      }
    }
  });

  it('actually translates Sign In copy', () => {
    expect(translate('en', 'auth.signIn.title')).toBe('Welcome Back');
    expect(translate('es', 'auth.signIn.title')).toBe('Bienvenido de nuevo');
    expect(translate('es', 'auth.signIn.submit')).toBe('Iniciar sesión');
  });

  it('falls back to English for unknown locales', () => {
    expect(translate('es', 'auth.signIn.demo')).toContain('test@example.com');
  });
});
