import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../../core/widgets/widgets.dart';
import '../providers.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});
  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleSubmit() async {
    final l10n = AppLocalizations.of(context);
    if (_emailController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.t('validation.emailRequired'))),
      );
      return;
    }
    setState(() => _isLoading = true);
    try {
      await ref.read(forgotPasswordUseCaseProvider)(_emailController.text);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(l10n.t('auth.forgot.successMessage'))),
        );
        context.pop();
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(l10n.t('common.errorGeneric'))),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(l10n.t('auth.forgot.title'))),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Text('🔐', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 16),
              Text(l10n.t('auth.forgot.title'), style: Theme.of(context).textTheme.headlineLarge),
              const SizedBox(height: 8),
              Text(l10n.t('auth.forgot.subtitle'), style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(height: 32),
              AppInput(label: l10n.t('auth.signIn.emailLabel'), hint: l10n.t('auth.signIn.emailPlaceholder'), controller: _emailController, keyboardType: TextInputType.emailAddress, prefixIcon: Icons.email_outlined),
              AppButton(title: l10n.t('auth.forgot.submit'), onPressed: _handleSubmit, isLoading: _isLoading),
            ],
          ),
        ),
      ),
    );
  }
}
