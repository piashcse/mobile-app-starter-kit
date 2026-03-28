import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/widgets.dart';
import 'signup_controller.dart';

class SignupScreen extends ConsumerStatefulWidget {
  const SignupScreen({super.key});

  @override
  ConsumerState<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends ConsumerState<SignupScreen> {
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
    final controller = ref.read(signUpControllerProvider.notifier);
    final success = await controller.signUp(
      name: _nameController.text,
      email: _emailController.text,
      password: _passwordController.text,
    );

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Account created! Please sign in.')),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(signUpControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Sign Up')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Text('🚀', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 16),
            Text('Create Account', style: Theme.of(context).textTheme.headlineLarge),
            const SizedBox(height: 32),
            AppInput(label: 'Full Name', hint: 'Enter your name', controller: _nameController, prefixIcon: Icons.person_outlined),
            AppInput(label: 'Email', hint: 'Enter your email', controller: _emailController, keyboardType: TextInputType.emailAddress, prefixIcon: Icons.email_outlined),
            AppInput(label: 'Password', hint: 'Create a password', controller: _passwordController, obscureText: true, prefixIcon: Icons.lock_outlined),
            AppInput(label: 'Confirm Password', hint: 'Confirm password', controller: _confirmPasswordController, obscureText: true, prefixIcon: Icons.lock_outlined),
            const SizedBox(height: 8),
            AppButton(title: 'Create Account', onPressed: _handleSignUp, isLoading: state.isLoading),
          ],
        ),
      ),
    );
  }
}
