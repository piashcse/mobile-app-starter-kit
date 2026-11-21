import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _localeKey = 'mask.locale';

class LocaleController extends Notifier<Locale?> {
  @override
  Locale? build() {
    Future.microtask(_load);
    return null; // null = follow the device locale
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_localeKey);
    if (saved != null && saved.isNotEmpty) {
      state = Locale(saved);
    }
  }

  Future<void> setLocale(Locale? locale) async {
    state = locale;
    final prefs = await SharedPreferences.getInstance();
    if (locale == null) {
      await prefs.remove(_localeKey);
    } else {
      await prefs.setString(_localeKey, locale.languageCode);
    }
  }
}

final localeProvider =
    NotifierProvider<LocaleController, Locale?>(LocaleController.new);
