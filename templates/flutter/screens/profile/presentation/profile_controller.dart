import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/profile_repository.dart';
import '../../../core/models/user_profile.dart';

class ProfileState {
  final bool isLoading;
  final UserProfile? profile;
  final String? error;

  const ProfileState({this.isLoading = false, this.profile, this.error});

  ProfileState copyWith({
    bool? isLoading,
    UserProfile? profile,
    String? error,
  }) =>
      ProfileState(
        isLoading: isLoading ?? this.isLoading,
        profile: profile ?? this.profile,
        error: error,
      );
}

class ProfileController extends Notifier<ProfileState> {
  @override
  ProfileState build() {
    Future.microtask(_loadProfile);
    return const ProfileState(isLoading: true);
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await ref.read(profileRepositoryProvider).getProfile();
      state = state.copyWith(isLoading: false, profile: profile);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final profileControllerProvider =
    NotifierProvider<ProfileController, ProfileState>(ProfileController.new);
