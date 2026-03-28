import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/profile_repository.dart';

class ProfileState {
  final bool isLoading;
  final Map<String, dynamic>? profile;
  final String? error;
  const ProfileState({this.isLoading = false, this.profile, this.error});
  ProfileState copyWith({bool? isLoading, Map<String, dynamic>? profile, String? error}) =>
      ProfileState(isLoading: isLoading ?? this.isLoading, profile: profile ?? this.profile, error: error);
}

class ProfileController extends StateNotifier<ProfileState> {
  final ProfileRepository _repository;

  ProfileController(this._repository) : super(const ProfileState(isLoading: true)) {
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await _repository.getProfile();
      state = state.copyWith(isLoading: false, profile: profile);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final profileControllerProvider = StateNotifierProvider<ProfileController, ProfileState>(
  (ref) => ProfileController(ref.read(profileRepositoryProvider)),
);
