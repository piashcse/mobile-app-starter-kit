import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/signup_repository.dart';

class SignUpState {
  final bool isLoading;
  final String? error;

  const SignUpState({this.isLoading = false, this.error});

  SignUpState copyWith({bool? isLoading, String? error}) =>
      SignUpState(isLoading: isLoading ?? this.isLoading, error: error);
}

class SignUpController extends Notifier<SignUpState> {
  @override
  SignUpState build() => const SignUpState();

  Future<bool> signUp({
    required String name,
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await ref
          .read(signUpRepositoryProvider)
          .register(name: name, email: email, password: password);
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }
}

final signUpControllerProvider =
    NotifierProvider<SignUpController, SignUpState>(SignUpController.new);
