import '../../../../core/api/api_client.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/repositories/profile_repository.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  const ProfileRepositoryImpl(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<UserProfile> getProfile() async {
    final response = await _apiClient.get('/user/profile');
    return UserProfile.fromJson(Map<String, dynamic>.from(response.data));
  }

  @override
  Future<void> updateProfile(UserProfile profile) async {
    await _apiClient.put('/user/profile', data: {
      'name': profile.name,
      'email': profile.email,
      'phone': profile.phone,
      'bio': profile.bio,
      'location': profile.location,
    });
  }
}
