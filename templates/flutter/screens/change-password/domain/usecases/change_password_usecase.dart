import '../repositories/change_password_repository.dart';

class ChangePasswordUseCase {
  const ChangePasswordUseCase(this._repository);

  final ChangePasswordRepository _repository;

  Future<void> call({
    required String currentPassword,
    required String newPassword,
  }) =>
      _repository.changePassword(
        currentPassword: currentPassword,
        newPassword: newPassword,
      );
}
