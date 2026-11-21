abstract interface class ForgotPasswordRepository {
  Future<void> sendResetLink(String email);
}
