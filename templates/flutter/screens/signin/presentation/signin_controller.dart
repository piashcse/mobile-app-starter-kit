import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/signin_repository.dart';

class SignInState {
  final bool isLoading;
  final String? error;
  final bool isAuthenticated;

  const SignInState({
    this.isLoading = false,
    this.error,
    this.isAuthenticated = false,
  });

  SignInState copyWith({bool? isLoading, String? error, bool? isAuthenticated}) {
    return SignInState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
    );
  }
}

class SignInController extends Notifier<SignInState> {
  @override
  SignInState build() => const SignInState();

  Future<bool> signIn(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await ref.read(signInRepositoryProvider).signIn(email, password);
      state = state.copyWith(isLoading: false, isAuthenticated: true);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }
}

final signInControllerProvider =
    NotifierProvider<SignInController, SignInState>(SignInController.new);
