import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api/api_client_provider.dart';
import 'data/repositories/signin_repository_impl.dart';
import 'domain/repositories/signin_repository.dart';
import 'domain/usecases/signin_usecase.dart';

final signInRepositoryProvider = Provider<SignInRepository>(
  (ref) => SignInRepositoryImpl(ref.read(apiClientProvider)),
);

final signInUseCaseProvider = Provider<SignInUseCase>(
  (ref) => SignInUseCase(ref.read(signInRepositoryProvider)),
);
