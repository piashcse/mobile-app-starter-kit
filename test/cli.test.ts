import { describe, expect, it } from 'vitest';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { buildInitPrompts } from '../src/commands/init.js';

describe('CLI packaging', () => {
  it('keeps the executable shebang on the entry point', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, '..', 'src', 'index.ts'),
      'utf-8'
    );
    expect(source.startsWith('#!/usr/bin/env node')).toBe(true);
  });

  it('declares a valid bin entry', () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf-8')
    ) as { bin?: Record<string, string> };
    expect(pkg.bin?.['mobile-app-starter-kit']).toBe('dist/index.js');
  });

  it('only uses prompt types registered by inquirer', () => {
    const registered = inquirer.prompt.prompts as Record<string, unknown>;
    for (const prompt of buildInitPrompts({})) {
      expect(registered[prompt.type]).toBeTypeOf('function');
    }
  });
});
