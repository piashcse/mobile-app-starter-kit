import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';

class SignUpRepository {
  final ApiClient _apiClient;
  SignUpRepository(this._apiClient);

  Future<void> register({required String name, required String email, required String password}) async {
    final response = await _apiClient.post('/auth/register', data: {'name': name, 'email': email, 'password': password});
    if (response.statusCode != 200) throw Exception(response.data['message'] ?? 'Registration failed');
  }
}

final signUpRepositoryProvider = Provider<SignUpRepository>((ref) => SignUpRepository(ApiClient()));
