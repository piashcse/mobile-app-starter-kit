/// Compile-time configuration. Override with:
/// `flutter run --dart-define=USE_MOCK_API=false --dart-define=API_BASE_URL=...`
class AppConfig {
  AppConfig._();

  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.example.com',
  );

  static const useMockApi = bool.fromEnvironment(
    'USE_MOCK_API',
    defaultValue: true,
  );
}
