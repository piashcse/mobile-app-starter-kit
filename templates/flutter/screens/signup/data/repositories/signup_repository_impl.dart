import '../../../../core/api/api_client.dart';
import '../../domain/repositories/signup_repository.dart';

class SignUpRepositoryImpl implements SignUpRepository {
  const SignUpRepositoryImpl(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await _apiClient.post(
      '/auth/register',
      data: {'name': name, 'email': email, 'password': password},
    );
    if (response.statusCode != 200) {
      throw Exception(response.data['message'] ?? 'Registration failed');
    }
  }
}
