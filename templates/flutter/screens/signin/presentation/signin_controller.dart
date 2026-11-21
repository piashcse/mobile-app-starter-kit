import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/usecases/signin_usecase.dart';
import '../../../core/observability/analytics.dart';
import '../providers.dart';

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
  late final SignInUseCase _signIn = ref.read(signInUseCaseProvider);

  @override
  SignInState build() => const SignInState();

  Future<bool> signIn(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _signIn(email, password);
      ref.read(analyticsProvider).track('sign_in');
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
