import 'package:flutter/material.dart';
import '../../../core/l10n/app_localizations.dart';

class TermsScreen extends StatelessWidget {
  const TermsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(AppLocalizations.of(context).t('settings.termsOfService'))),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Text(AppLocalizations.of(context).t('legal.terms'), style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.6)),
      ),
    );
  }
}
