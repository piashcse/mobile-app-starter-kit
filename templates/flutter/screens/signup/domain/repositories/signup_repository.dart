abstract interface class SignUpRepository {
  Future<void> register({
    required String name,
    required String email,
    required String password,
  });
}
