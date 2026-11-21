import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/app_config.dart';

abstract interface class Analytics {
  void track(String event, [Map<String, Object?> properties]);
}

class DebugAnalytics implements Analytics {
  const DebugAnalytics();

  @override
  void track(String event, [Map<String, Object?> properties = const {}]) {
    if (AppConfig.analyticsEnabled) {
      // ignore: avoid_print
      print('[analytics] $event $properties');
    }
  }
}

final analyticsProvider = Provider<Analytics>(
  (ref) => const DebugAnalytics(),
);
