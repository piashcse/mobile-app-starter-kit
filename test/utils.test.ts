import { describe, expect, it } from 'vitest';
import {
  deriveProjectNames,
  screenIdToCases,
  toKebab,
  toSnake,
} from '../src/utils/file.js';
import {
  parseScreenList,
  validateFramework,
  validatePackageName,
  validateProjectName,
  validateScreens,
} from '../src/utils/validator.js';

describe('screenIdToCases', () => {
  it('keeps compound screen symbol casing intact', () => {
    expect(screenIdToCases('signin')).toMatchObject({
      kebab: 'signin',
      snake: 'signin',
      camel: 'signIn',
      pascal: 'SignIn',
      title: 'Sign In',
    });
    expect(screenIdToCases('signup')).toMatchObject({
      pascal: 'SignUp',
      camel: 'signUp',
      title: 'Sign Up',
    });
  });

  it('handles hyphenated screen ids', () => {
    expect(screenIdToCases('forgot-password')).toMatchObject({
      kebab: 'forgot-password',
      snake: 'forgot_password',
      camel: 'forgotPassword',
      pascal: 'ForgotPassword',
    });
  });
});

describe('project name derivation', () => {
  it('normalizes spaces, casing, and hyphens', () => {
    expect(toKebab('My Cool App')).toBe('my-cool-app');
    expect(toSnake('My Cool App')).toBe('my_cool_app');
    expect(toKebab('  Already-kebab  ')).toBe('already-kebab');
  });

  it('derives every identifier from a free-form name', () => {
    expect(deriveProjectNames('My Cool App')).toEqual({
      projectName: 'My Cool App',
      dirName: 'my-cool-app',
      slug: 'my-cool-app',
      dartPackage: 'my_cool_app',
      packageName: 'com.example.mycoolapp',
    });
  });

  it('avoids Java/Kotlin keywords in derived package names', () => {
    expect(deriveProjectNames('Final').packageName).toBe(
      'com.example.finalapp'
    );
    expect(deriveProjectNames('class').packageName).toBe(
      'com.example.classapp'
    );
  });
});

describe('validators', () => {
  it('validates frameworks', () => {
    expect(validateFramework('expo')).toBe(true);
    expect(validateFramework('flutter')).toBe(true);
    expect(validateFramework('kmp')).toBe(true);
    expect(validateFramework('native')).toBe(false);
  });

  it('validates package names', () => {
    expect(validatePackageName('com.example.app')).toBe(true);
    expect(validatePackageName('com.example')).toBe(true);
    expect(validatePackageName('Com.Example.App')).toBe(false);
    expect(validatePackageName('com..app')).toBe(false);
    expect(validatePackageName('com.example;rm -rf /')).toBe(false);
    expect(validatePackageName('com.acme.final')).toBe(false);
    expect(validatePackageName('com.acme.class')).toBe(false);
  });

  it('validates project names', () => {
    expect(validateProjectName('My App')).toBe(true);
    expect(validateProjectName('my-app_2')).toBe(true);
    expect(validateProjectName('2app')).toBe(false);
    expect(validateProjectName('')).toBe(false);
  });

  it('de-duplicates and filters screens', () => {
    expect(validateScreens(['signin', 'signin', 'profile', 'nope'])).toEqual({
      valid: ['signin', 'profile'],
      invalid: ['nope'],
    });
    expect(parseScreenList(' signin, PROFILE ,,faq ')).toEqual([
      'signin',
      'profile',
      'faq',
    ]);
  });
});
