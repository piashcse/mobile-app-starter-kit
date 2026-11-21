import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _tokenKey = 'mask.auth.token';

class AuthState {
  final bool isAuthenticated;
  final bool isLoading;

  const AuthState({this.isAuthenticated = false, this.isLoading = true});

  AuthState copyWith({bool? isAuthenticated, bool? isLoading}) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class AuthController extends Notifier<AuthState> {
  @override
  AuthState build() {
    _hydrate();
    return const AuthState();
  }

  Future<void> _hydrate() async {
    final prefs = await SharedPreferences.getInstance();
    state = AuthState(
      isAuthenticated: prefs.getString(_tokenKey) != null,
      isLoading: false,
    );
  }

  Future<void> signIn(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    state = const AuthState(isAuthenticated: true, isLoading: false);
  }

  Future<void> signOut() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    state = const AuthState(isAuthenticated: false, isLoading: false);
  }
}

final authProvider = NotifierProvider<AuthController, AuthState>(
  AuthController.new,
);
