import '../../../../core/api/api_client.dart';
import '../../domain/repositories/signin_repository.dart';

class SignInRepositoryImpl implements SignInRepository {
  const SignInRepositoryImpl(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<void> signIn(String email, String password) async {
    final response = await _apiClient.post(
      '/auth/login',
      data: {'email': email, 'password': password},
    );

    if (response.statusCode != 200) {
      throw Exception(response.data['message'] ?? 'Login failed');
    }
  }
}
