import '../repositories/forgot_password_repository.dart';

class ForgotPasswordUseCase {
  const ForgotPasswordUseCase(this._repository);

  final ForgotPasswordRepository _repository;

  Future<void> call(String email) => _repository.sendResetLink(email);
}
