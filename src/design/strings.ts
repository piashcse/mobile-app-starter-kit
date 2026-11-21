/**
 * Single source of truth for user-facing copy. Platform catalogs are generated
 * from this module.
 */

export const supportedLocales = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
] as const;

export type LocaleCode = (typeof supportedLocales)[number]['code'];

const en = {
  // Common
  'common.language': 'Language',
  'common.languageEnglish': 'English',
  'common.languageSpanish': 'Spanish',
  'common.success': 'Success',
  'common.ok': 'OK',
  'common.user': 'User',
  'common.loading': 'Loading...',
  'common.joined': 'Joined',
  'common.errorTitle': 'Error',
  'profile.title': 'Profile',
  'profile.loading': 'Loading profile...',
  'faq.heading': 'Frequently Asked Questions',
  'faq.subtitle': 'Find answers to common questions',
  'faq.loading': 'Loading FAQ...',
  'notifications.loading': 'Loading notifications...',
  'about.visitWebsite': 'Visit Website',
  'about.contactSupport': 'Contact Support',
  'common.cancel': 'Cancel',
  'common.retry': 'Retry',
  'common.notSet': 'Not set',
  'common.settings': 'Settings',
  'common.signOut': 'Sign Out',
  'common.email': 'Email',
  'common.phone': 'Phone',
  'common.location': 'Location',
  'common.website': 'Website',
  'common.support': 'Support',
  'common.version': 'Version {version}',
  'common.copyright': '© {year} All rights reserved.',
  'common.showPassword': 'Show password',
  'common.hidePassword': 'Hide password',
  'common.errorGeneric': 'Something went wrong. Please try again.',
  'common.errorNetwork': 'Network error. Check your connection.',
  'common.errorNotFound': 'Not found.',

  // Validation
  'validation.nameRequired': 'Name is required',
  'validation.emailRequired': 'Email is required',
  'validation.emailInvalid': 'Invalid email format',
  'validation.passwordRequired': 'Password is required',
  'validation.passwordTooShort': 'Password must be at least 8 characters',
  'validation.passwordsDoNotMatch': 'Passwords do not match',
  'validation.passwordMustDiffer': 'New password must be different',
  'validation.currentPasswordRequired': 'Current password is required',

  // Sign in
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
    'Password must be at least 8 characters',
  'auth.signIn.error.invalidCredentials':
    'Login failed. Try test@example.com / password',

  // Sign up
  'auth.signUp.title': 'Create Account',
  'auth.signUp.subtitle': 'Join us and start your journey',
  'auth.signUp.error': 'Registration failed',
  'auth.signUp.successMessage': 'Account created successfully!',
  'auth.signUp.nameLabel': 'Full Name',
  'auth.signUp.namePlaceholder': 'Enter your name',
  'auth.signUp.passwordPlaceholder': 'Create a password',
  'auth.signUp.confirmPasswordLabel': 'Confirm Password',
  'auth.signUp.confirmPasswordPlaceholder': 'Confirm password',
  'auth.signUp.submit': 'Create Account',
  'auth.signUp.signInPrompt': 'Already have an account?',
  'auth.signUp.signInAction': 'Sign In',

  // Forgot password
  'auth.forgot.title': 'Forgot Password?',
  'auth.forgot.subtitle': 'Enter your email to receive a reset link.',
  'auth.forgot.submit': 'Send Reset Link',
  'auth.forgot.backToSignIn': 'Back to Sign In',
  'auth.forgot.successMessage': 'Password reset link sent!',

  // Change password
  'auth.changePassword.title': 'Change Password',
  'auth.changePassword.currentLabel': 'Current Password',
  'auth.changePassword.newLabel': 'New Password',
  'auth.changePassword.confirmLabel': 'Confirm Password',
  'auth.changePassword.subtitle': 'Create a strong new password',
  'auth.changePassword.submit': 'Update Password',
  'auth.changePassword.successMessage': 'Password changed successfully!',
  'auth.changePassword.error': 'Failed to change password',
  'auth.changePassword.currentPlaceholder': 'Enter current password',
  'auth.changePassword.newPlaceholder': 'Enter new password (min 8 chars)',
  'auth.changePassword.confirmPlaceholder': 'Confirm new password',

  // Onboarding
  'onboarding.skip': 'Skip',
  'onboarding.next': 'Next',
  'onboarding.getStarted': 'Get Started',
  'onboarding.slide1.title': 'Welcome',
  'onboarding.slide1.description': 'Discover a new way to manage your life.',
  'onboarding.slide2.title': 'Secure & Private',
  'onboarding.slide2.description': 'Your data is encrypted and protected.',
  'onboarding.slide3.title': 'Fast & Reliable',
  'onboarding.slide3.description': 'Lightning-fast performance.',
  'onboarding.slide4.title': 'Get Started',
  'onboarding.slide4.description': 'Create your account today!',

  // Settings
  'settings.title': 'Settings',
  'settings.preferences': 'Preferences',
  'settings.account': 'Account',
  'settings.developer': 'Developer',
  'settings.useMockApi': 'Use mock API',
  'settings.pushNotifications': 'Push Notifications',
  'settings.darkMode': 'Dark Mode',
  'settings.biometricLogin': 'Biometric Login',
  'settings.usageAnalytics': 'Usage Analytics',
  'settings.changePassword': 'Change Password',
  'settings.privacyPolicy': 'Privacy Policy',
  'settings.termsOfService': 'Terms of Service',
  'settings.faq': 'FAQ',
  'settings.about': 'About',

  // FAQ
  'faq.title': 'FAQ',

  // Notifications
  'notifications.title': 'Notifications',
  'notifications.empty': 'No notifications yet',

  // About
  'about.description':
    'A modern mobile app built with Compose Multiplatform and MVVM architecture.',

  // Legal content
  'legal.privacyPolicy': `Privacy Policy

Last Updated: March 2025

We collect information you provide directly. We use industry-standard encryption to protect your data. You have the right to access, correct, delete, and export your data.

Contact: privacy@example.com`,
  'legal.terms': `Terms of Service

Last Updated: March 2025

By using our app, you agree to these terms. You are responsible for your account credentials.

Contact: legal@example.com`,
} as const;

export type TranslationKey = keyof typeof en;

const es: Record<TranslationKey, string> = {
  // Common
  'common.language': 'Idioma',
  'common.languageEnglish': 'Inglés',
  'common.languageSpanish': 'Español',
  'common.success': 'Éxito',
  'common.ok': 'Aceptar',
  'common.user': 'Usuario',
  'common.loading': 'Cargando...',
  'common.joined': 'Se unió',
  'common.errorTitle': 'Error',
  'profile.title': 'Perfil',
  'profile.loading': 'Cargando perfil...',
  'faq.heading': 'Preguntas frecuentes',
  'faq.subtitle': 'Encuentra respuestas a preguntas comunes',
  'faq.loading': 'Cargando preguntas...',
  'notifications.loading': 'Cargando notificaciones...',
  'about.visitWebsite': 'Visitar sitio web',
  'about.contactSupport': 'Contactar soporte',
  'common.cancel': 'Cancelar',
  'common.retry': 'Reintentar',
  'common.notSet': 'No definido',
  'common.settings': 'Ajustes',
  'common.signOut': 'Cerrar sesión',
  'common.email': 'Correo electrónico',
  'common.phone': 'Teléfono',
  'common.location': 'Ubicación',
  'common.website': 'Sitio web',
  'common.support': 'Soporte',
  'common.version': 'Versión {version}',
  'common.copyright': '© {year} Todos los derechos reservados.',
  'common.showPassword': 'Mostrar contraseña',
  'common.hidePassword': 'Ocultar contraseña',
  'common.errorGeneric': 'Algo salió mal. Inténtalo de nuevo.',
  'common.errorNetwork': 'Error de red. Revisa tu conexión.',
  'common.errorNotFound': 'No encontrado.',

  // Validation
  'validation.nameRequired': 'El nombre es obligatorio',
  'validation.emailRequired': 'El correo es obligatorio',
  'validation.emailInvalid': 'Formato de correo inválido',
  'validation.passwordRequired': 'La contraseña es obligatoria',
  'validation.passwordTooShort':
    'La contraseña debe tener al menos 8 caracteres',
  'validation.passwordsDoNotMatch': 'Las contraseñas no coinciden',
  'validation.passwordMustDiffer': 'La nueva contraseña debe ser diferente',
  'validation.currentPasswordRequired': 'La contraseña actual es obligatoria',

  // Sign in
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
    'La contraseña debe tener al menos 8 caracteres',
  'auth.signIn.error.invalidCredentials':
    'No se pudo iniciar sesión. Usa test@example.com / password',

  // Sign up
  'auth.signUp.title': 'Crear cuenta',
  'auth.signUp.subtitle': 'Únete y comienza tu viaje',
  'auth.signUp.error': 'No se pudo crear la cuenta',
  'auth.signUp.successMessage': '¡Cuenta creada correctamente!',
  'auth.signUp.nameLabel': 'Nombre completo',
  'auth.signUp.namePlaceholder': 'Ingresa tu nombre',
  'auth.signUp.passwordPlaceholder': 'Crea una contraseña',
  'auth.signUp.confirmPasswordLabel': 'Confirmar contraseña',
  'auth.signUp.confirmPasswordPlaceholder': 'Confirma la contraseña',
  'auth.signUp.submit': 'Crear cuenta',
  'auth.signUp.signInPrompt': '¿Ya tienes una cuenta?',
  'auth.signUp.signInAction': 'Iniciar sesión',

  // Forgot password
  'auth.forgot.title': '¿Olvidaste tu contraseña?',
  'auth.forgot.subtitle':
    'Ingresa tu correo para recibir un enlace de restablecimiento.',
  'auth.forgot.submit': 'Enviar enlace',
  'auth.forgot.backToSignIn': 'Volver a iniciar sesión',
  'auth.forgot.successMessage': '¡Enlace de restablecimiento enviado!',

  // Change password
  'auth.changePassword.title': 'Cambiar contraseña',
  'auth.changePassword.currentLabel': 'Contraseña actual',
  'auth.changePassword.newLabel': 'Nueva contraseña',
  'auth.changePassword.confirmLabel': 'Confirmar contraseña',
  'auth.changePassword.subtitle': 'Crea una contraseña nueva y segura',
  'auth.changePassword.submit': 'Actualizar contraseña',
  'auth.changePassword.successMessage':
    '¡Contraseña actualizada correctamente!',
  'auth.changePassword.error': 'No se pudo cambiar la contraseña',
  'auth.changePassword.currentPlaceholder': 'Ingresa la contraseña actual',
  'auth.changePassword.newPlaceholder': 'Ingresa una nueva contraseña (mín. 8)',
  'auth.changePassword.confirmPlaceholder': 'Confirma la nueva contraseña',

  // Onboarding
  'onboarding.skip': 'Omitir',
  'onboarding.next': 'Siguiente',
  'onboarding.getStarted': 'Comenzar',
  'onboarding.slide1.title': 'Bienvenido',
  'onboarding.slide1.description':
    'Descubre una nueva forma de gestionar tu vida.',
  'onboarding.slide2.title': 'Seguro y privado',
  'onboarding.slide2.description': 'Tus datos están cifrados y protegidos.',
  'onboarding.slide3.title': 'Rápido y confiable',
  'onboarding.slide3.description': 'Rendimiento ultrarrápido.',
  'onboarding.slide4.title': 'Comenzar',
  'onboarding.slide4.description': '¡Crea tu cuenta hoy mismo!',

  // Settings
  'settings.title': 'Ajustes',
  'settings.preferences': 'Preferencias',
  'settings.account': 'Cuenta',
  'settings.developer': 'Desarrollador',
  'settings.useMockApi': 'Usar API simulada',
  'settings.pushNotifications': 'Notificaciones push',
  'settings.darkMode': 'Modo oscuro',
  'settings.biometricLogin': 'Inicio biométrico',
  'settings.usageAnalytics': 'Analítica de uso',
  'settings.changePassword': 'Cambiar contraseña',
  'settings.privacyPolicy': 'Política de privacidad',
  'settings.termsOfService': 'Términos del servicio',
  'settings.faq': 'Preguntas frecuentes',
  'settings.about': 'Acerca de',

  // FAQ
  'faq.title': 'Preguntas frecuentes',

  // Notifications
  'notifications.title': 'Notificaciones',
  'notifications.empty': 'Aún no hay notificaciones',

  // About
  'about.description':
    'Una aplicación móvil moderna creada con Compose Multiplatform y arquitectura MVVM.',

  // Legal content
  'legal.privacyPolicy': `Política de privacidad

Última actualización: marzo de 2025

Recopilamos la información que proporcionas directamente. Usamos cifrado estándar de la industria para proteger tus datos. Tienes derecho a acceder, corregir, eliminar y exportar tus datos.

Contacto: privacy@example.com`,
  'legal.terms': `Términos del servicio

Última actualización: marzo de 2025

Al usar nuestra aplicación, aceptas estos términos. Eres responsable de las credenciales de tu cuenta.

Contacto: legal@example.com`,
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
