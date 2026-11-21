abstract interface class SignInRepository {
  Future<void> signIn(String email, String password);
}
