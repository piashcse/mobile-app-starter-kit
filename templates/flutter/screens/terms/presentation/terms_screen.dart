import 'package:flutter/material.dart';
import '../../../core/api/mock_data.dart';

class TermsScreen extends StatelessWidget {
  const TermsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Terms of Service')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Text(MockData.terms, style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.6)),
      ),
    );
  }
}
