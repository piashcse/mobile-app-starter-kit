import { isEmail, isStrongPassword } from '../validation';

describe('validation', () => {
  it('accepts valid emails and rejects invalid ones', () => {
    expect(isEmail('test@example.com')).toBe(true);
    expect(isEmail('test@example')).toBe(false);
    expect(isEmail('')).toBe(false);
  });

  it('enforces the minimum password length', () => {
    expect(isStrongPassword('password')).toBe(true);
    expect(isStrongPassword('short')).toBe(false);
    expect(isStrongPassword('12345678', 8)).toBe(true);
  });
});
