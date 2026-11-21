abstract interface class ChangePasswordRepository {
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  });
}
