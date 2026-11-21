import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../../core/widgets/widgets.dart';
import '../providers.dart';

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
    final l10n = AppLocalizations.of(context);
    if (_newController.text != _confirmController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.t('validation.passwordsDoNotMatch'))),
      );
      return;
    }
    if (_newController.text.length < 8) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.t('validation.passwordTooShort'))),
      );
      return;
    }
    setState(() => _isLoading = true);
    try {
      await ref.read(changePasswordUseCaseProvider)(
        currentPassword: _currentController.text,
        newPassword: _newController.text,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(l10n.t('auth.changePassword.successMessage'))));
        context.pop();
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(l10n.t('auth.changePassword.error'))),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(AppLocalizations.of(context).t('auth.changePassword.title'))),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(children: [
          const Text('🔑', style: TextStyle(fontSize: 48)),
          const SizedBox(height: 16),
          Text(AppLocalizations.of(context).t('auth.changePassword.title'), style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 32),
          AppInput(label: AppLocalizations.of(context).t('auth.changePassword.currentLabel'), controller: _currentController, obscureText: true, prefixIcon: Icons.lock_outlined),
          AppInput(label: AppLocalizations.of(context).t('auth.changePassword.newLabel'), controller: _newController, obscureText: true, prefixIcon: Icons.lock_outlined),
          AppInput(label: AppLocalizations.of(context).t('auth.changePassword.confirmLabel'), controller: _confirmController, obscureText: true, prefixIcon: Icons.lock_outlined),
          AppButton(title: AppLocalizations.of(context).t('auth.changePassword.submit'), onPressed: _handleSubmit, isLoading: _isLoading),
        ]),
      ),
    );
  }
}
