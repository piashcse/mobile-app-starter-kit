import 'package:flutter/material.dart';
import '../../../core/api/mock_data.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Privacy Policy')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Text(MockData.privacyPolicy, style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.6)),
      ),
    );
  }
}
