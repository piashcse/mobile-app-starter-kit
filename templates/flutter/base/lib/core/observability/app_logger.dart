import 'package:flutter/foundation.dart';

class AppLogger {
  AppLogger._();

  static void debug(String message) {
    if (kDebugMode) debugPrint('[debug] $message');
  }

  static void warn(String message, [Object? error]) {
    if (kDebugMode) debugPrint('[warn] $message ${error ?? ''}');
  }

  static void error(String message, [Object? error]) {
    debugPrint('[error] $message ${error ?? ''}');
  }
}
