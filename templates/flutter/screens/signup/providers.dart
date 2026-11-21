import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api/api_client_provider.dart';
import 'data/repositories/signup_repository_impl.dart';
import 'domain/repositories/signup_repository.dart';
import 'domain/usecases/signup_usecase.dart';

final signUpRepositoryProvider = Provider<SignUpRepository>(
  (ref) => SignUpRepositoryImpl(ref.read(apiClientProvider)),
);

final signUpUseCaseProvider = Provider<SignUpUseCase>(
  (ref) => SignUpUseCase(ref.read(signUpRepositoryProvider)),
);
