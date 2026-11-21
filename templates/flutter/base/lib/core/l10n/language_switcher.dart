import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app_localizations.dart';
import 'locale_provider.dart';

class LanguageSwitcher extends ConsumerWidget {
  const LanguageSwitcher({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final locale = ref.watch(localeProvider);
    final current = (locale ?? Localizations.localeOf(context)).languageCode;

    return Semantics(
      container: true,
      label: l10n.t('common.language'),
      child: Wrap(
        alignment: WrapAlignment.center,
        crossAxisAlignment: WrapCrossAlignment.center,
        spacing: 4,
        children: [
          Text(
            '${l10n.t('common.language')}:',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          for (final locale in AppLocalizations.supportedLocales)
            TextButton(
              onPressed: () =>
                  ref.read(localeProvider.notifier).setLocale(locale),
              child: Text(
                AppLocalizations.nativeLabels[locale.languageCode] ??
                    locale.languageCode,
                style: TextStyle(
                  fontWeight: current == locale.languageCode
                      ? FontWeight.w600
                      : FontWeight.w400,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
