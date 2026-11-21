/**
 * Single source of truth for user-facing copy. Platform catalogs are generated
 * from this module. Only keys used by the localized starter slice are included
 * for now; new screens add keys here and regenerate.
 */

export const supportedLocales = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
] as const;

export type LocaleCode = (typeof supportedLocales)[number]['code'];

const en = {
  'common.language': 'Language',
  'common.cancel': 'Cancel',
  'common.retry': 'Retry',

  'auth.signIn.logoLabel': 'Welcome',
  'auth.signIn.title': 'Welcome Back',
  'auth.signIn.subtitle': 'Sign in to continue to your account',
  'auth.signIn.emailLabel': 'Email',
  'auth.signIn.emailPlaceholder': 'Enter your email',
  'auth.signIn.passwordLabel': 'Password',
  'auth.signIn.passwordPlaceholder': 'Enter your password',
  'auth.signIn.submit': 'Sign In',
  'auth.signIn.showPassword': 'Show password',
  'auth.signIn.hidePassword': 'Hide password',
  'auth.signIn.forgotPassword': 'Forgot Password?',
  'auth.signIn.signUpPrompt': "Don't have an account?",
  'auth.signIn.signUpAction': 'Sign Up',
  'auth.signIn.demo': 'Demo: test@example.com / password',
  'auth.signIn.error.emailRequired': 'Email is required',
  'auth.signIn.error.emailInvalid': 'Invalid email format',
  'auth.signIn.error.passwordRequired': 'Password is required',
  'auth.signIn.error.passwordTooShort':
    'Password must be at least 6 characters',
  'auth.signIn.error.invalidCredentials':
    'Login failed. Try test@example.com / password',
} as const;

export type TranslationKey = keyof typeof en;

const es: Record<TranslationKey, string> = {
  'common.language': 'Idioma',
  'common.cancel': 'Cancelar',
  'common.retry': 'Reintentar',

  'auth.signIn.logoLabel': 'Bienvenido',
  'auth.signIn.title': 'Bienvenido de nuevo',
  'auth.signIn.subtitle': 'Inicia sesión para continuar a tu cuenta',
  'auth.signIn.emailLabel': 'Correo electrónico',
  'auth.signIn.emailPlaceholder': 'Ingresa tu correo',
  'auth.signIn.passwordLabel': 'Contraseña',
  'auth.signIn.passwordPlaceholder': 'Ingresa tu contraseña',
  'auth.signIn.submit': 'Iniciar sesión',
  'auth.signIn.showPassword': 'Mostrar contraseña',
  'auth.signIn.hidePassword': 'Ocultar contraseña',
  'auth.signIn.forgotPassword': '¿Olvidaste tu contraseña?',
  'auth.signIn.signUpPrompt': '¿No tienes una cuenta?',
  'auth.signIn.signUpAction': 'Registrarse',
  'auth.signIn.demo': 'Demo: test@example.com / password',
  'auth.signIn.error.emailRequired': 'El correo es obligatorio',
  'auth.signIn.error.emailInvalid': 'Formato de correo inválido',
  'auth.signIn.error.passwordRequired': 'La contraseña es obligatoria',
  'auth.signIn.error.passwordTooShort':
    'La contraseña debe tener al menos 6 caracteres',
  'auth.signIn.error.invalidCredentials':
    'No se pudo iniciar sesión. Usa test@example.com / password',
};

export const catalogs: Record<LocaleCode, Record<TranslationKey, string>> = {
  en,
  es,
};

export function translate(
  locale: LocaleCode,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const template = catalogs[locale]?.[key] ?? catalogs.en[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    String(params[name] ?? match)
  );
}
