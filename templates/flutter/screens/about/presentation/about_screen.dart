import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/api/mock_data.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/widgets.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final about = MockData.about;
    return Scaffold(
      appBar: AppBar(title: const Text('About')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Text('📱', style: TextStyle(fontSize: 60)),
            const SizedBox(height: 16),
            Text('{{projectName}}', style: Theme.of(context).textTheme.headlineLarge),
            const SizedBox(height: 4),
            Text('Version ${about['version']}', style: Theme.of(context).textTheme.bodySmall),
            const SizedBox(height: 24),
            AppCard(child: Text(about['description'] as String, style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.5))),
            const SizedBox(height: 16),
            AppCard(
              child: Column(
                children: [
                  _row(context, '🌐', 'Website', about['website'] as String),
                  const Divider(color: AppColors.border),
                  _row(context, '📧', 'Support', about['supportEmail'] as String),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text('© ${DateTime.now().year} All rights reserved.', style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
      ),
    );
  }

  Widget _row(BuildContext context, String icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(children: [
        Text(icon, style: const TextStyle(fontSize: 20)),
        const SizedBox(width: 12),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: Theme.of(context).textTheme.bodySmall),
          Text(value, style: Theme.of(context).textTheme.bodyLarge),
        ]),
      ]),
    );
  }
}
