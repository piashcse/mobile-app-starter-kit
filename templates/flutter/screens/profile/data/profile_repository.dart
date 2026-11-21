import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_client_provider.dart';
import '../../../core/models/user_profile.dart';

class ProfileRepository {
  final ApiClient _apiClient;
  ProfileRepository(this._apiClient);

  Future<UserProfile> getProfile() async {
    final response = await _apiClient.get('/user/profile');
    return UserProfile.fromJson(Map<String, dynamic>.from(response.data));
  }

  Future<void> updateProfile(Map<String, dynamic> data) async {
    await _apiClient.put('/user/profile', data: data);
  }
}

final profileRepositoryProvider = Provider<ProfileRepository>((ref) => ProfileRepository(ref.read(apiClientProvider)));
