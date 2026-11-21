import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/entities/user_profile.dart';
import '../domain/usecases/get_profile_usecase.dart';
import '../providers.dart';

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
  late final GetProfileUseCase _getProfile = ref.read(getProfileUseCaseProvider);

  @override
  ProfileState build() {
    Future.microtask(_loadProfile);
    return const ProfileState(isLoading: true);
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await _getProfile();
      state = state.copyWith(isLoading: false, profile: profile);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final profileControllerProvider =
    NotifierProvider<ProfileController, ProfileState>(ProfileController.new);
