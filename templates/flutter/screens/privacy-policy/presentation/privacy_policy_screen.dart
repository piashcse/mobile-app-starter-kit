import 'package:flutter/material.dart';
import '../../../core/l10n/app_localizations.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(AppLocalizations.of(context).t('settings.privacyPolicy'))),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Text(AppLocalizations.of(context).t('legal.privacyPolicy'), style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.6)),
      ),
    );
  }
}
