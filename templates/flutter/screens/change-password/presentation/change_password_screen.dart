import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/api/api_client_provider.dart';

class ChangePasswordScreen extends ConsumerStatefulWidget {
  const ChangePasswordScreen({super.key});
  @override
  ConsumerState<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends ConsumerState<ChangePasswordScreen> {
  final _currentController = TextEditingController();
  final _newController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleSubmit() async {
    if (_newController.text != _confirmController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Passwords do not match')),
      );
      return;
    }
    if (_newController.text.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Password must be at least 6 characters')),
      );
      return;
    }
    setState(() => _isLoading = true);
    try {
      await ref.read(apiClientProvider).post('/auth/change-password', data: {
        'currentPassword': _currentController.text,
        'newPassword': _newController.text,
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Password changed!')));
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
      appBar: AppBar(title: const Text('Change Password')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(children: [
          const Text('🔑', style: TextStyle(fontSize: 48)),
          const SizedBox(height: 16),
          Text('Change Password', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 32),
          AppInput(label: 'Current Password', controller: _currentController, obscureText: true, prefixIcon: Icons.lock_outlined),
          AppInput(label: 'New Password', controller: _newController, obscureText: true, prefixIcon: Icons.lock_outlined),
          AppInput(label: 'Confirm Password', controller: _confirmController, obscureText: true, prefixIcon: Icons.lock_outlined),
          AppButton(title: 'Update Password', onPressed: _handleSubmit, isLoading: _isLoading),
        ]),
      ),
    );
  }
}
