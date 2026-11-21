import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/api/api_client_provider.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});
  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleSubmit() async {
    if (_emailController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Email is required')),
      );
      return;
    }
    setState(() => _isLoading = true);
    try {
      await ref.read(apiClientProvider).post('/auth/forgot-password', data: {'email': _emailController.text});
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Reset link sent to your email!')),
        );
        context.pop();
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Forgot Password')),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Text('🔐', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 16),
              Text('Forgot Password?', style: Theme.of(context).textTheme.headlineLarge),
              const SizedBox(height: 8),
              Text('Enter your email to receive a reset link.', style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(height: 32),
              AppInput(label: 'Email', hint: 'Enter your email', controller: _emailController, keyboardType: TextInputType.emailAddress, prefixIcon: Icons.email_outlined),
              AppButton(title: 'Send Reset Link', onPressed: _handleSubmit, isLoading: _isLoading),
            ],
          ),
        ),
      ),
    );
  }
}
