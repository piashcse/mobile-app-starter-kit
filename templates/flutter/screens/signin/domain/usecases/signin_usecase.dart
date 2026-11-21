import '../repositories/signin_repository.dart';

class SignInUseCase {
  const SignInUseCase(this._repository);

  final SignInRepository _repository;

  Future<void> call(String email, String password) =>
      _repository.signIn(email, password);
}
