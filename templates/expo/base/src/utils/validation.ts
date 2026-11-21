const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (value: string): boolean =>
  emailPattern.test(value.trim());

export const isStrongPassword = (value: string, minLength = 8): boolean =>
  value.length >= minLength;
