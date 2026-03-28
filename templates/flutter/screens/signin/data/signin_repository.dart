import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';

class SignInRepository {
  final ApiClient _apiClient;

  SignInRepository(this._apiClient);

  Future<Map<String, dynamic>> signIn(String email, String password) async {
    final response = await _apiClient.post(
      '/auth/login',
      data: {'email': email, 'password': password},
    );

    if (response.statusCode == 200) {
      return response.data;
    }
    throw Exception(response.data['message'] ?? 'Login failed');
  }
}

final signInRepositoryProvider = Provider<SignInRepository>(
  (ref) => SignInRepository(ApiClient()),
);
