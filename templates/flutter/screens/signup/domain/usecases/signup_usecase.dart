import '../repositories/signup_repository.dart';

class SignUpUseCase {
  const SignUpUseCase(this._repository);

  final SignUpRepository _repository;

  Future<void> call({
    required String name,
    required String email,
    required String password,
  }) =>
      _repository.register(name: name, email: email, password: password);
}
