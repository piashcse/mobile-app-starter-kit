import '../../../../core/api/api_client.dart';
import '../../domain/repositories/forgot_password_repository.dart';

class ForgotPasswordRepositoryImpl implements ForgotPasswordRepository {
  const ForgotPasswordRepositoryImpl(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<void> sendResetLink(String email) async {
    await _apiClient.post('/auth/forgot-password', data: {'email': email});
  }
}
