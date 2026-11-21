import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../../core/widgets/widgets.dart';
import 'signup_controller.dart';

class SignUpScreen extends ConsumerStatefulWidget {
  const SignUpScreen({super.key});

  @override
  ConsumerState<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends ConsumerState<SignUpScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignUp() async {
    final l10n = AppLocalizations.of(context);
    final controller = ref.read(signUpControllerProvider.notifier);
    final success = await controller.signUp(
      name: _nameController.text,
      email: _emailController.text,
      password: _passwordController.text,
    );

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.t('auth.signUp.successMessage'))),
      );
      context.go('{{onboardingPath}}');
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(signUpControllerProvider);
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.t('auth.signUp.title'))),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Text('🚀', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 16),
            Text(l10n.t('auth.signUp.title'), style: Theme.of(context).textTheme.headlineLarge),
            const SizedBox(height: 32),
            AppInput(label: l10n.t('auth.signUp.nameLabel'), hint: l10n.t('auth.signUp.namePlaceholder'), controller: _nameController, prefixIcon: Icons.person_outlined),
            AppInput(label: l10n.t('auth.signIn.emailLabel'), hint: l10n.t('auth.signIn.emailPlaceholder'), controller: _emailController, keyboardType: TextInputType.emailAddress, prefixIcon: Icons.email_outlined),
            AppInput(label: l10n.t('auth.signIn.passwordLabel'), hint: l10n.t('auth.signUp.passwordPlaceholder'), controller: _passwordController, obscureText: true, prefixIcon: Icons.lock_outlined),
            AppInput(label: l10n.t('auth.signUp.confirmPasswordLabel'), hint: l10n.t('auth.signUp.confirmPasswordPlaceholder'), controller: _confirmPasswordController, obscureText: true, prefixIcon: Icons.lock_outlined),
            if (state.error != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text(
                  state.error!,
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                ),
              ),
            const SizedBox(height: 8),
            AppButton(title: l10n.t('auth.signUp.submit'), onPressed: _handleSignUp, isLoading: state.isLoading),
          ],
        ),
      ),
    );
  }
}
