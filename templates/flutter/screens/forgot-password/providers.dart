import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api/api_client_provider.dart';
import 'data/repositories/forgot_password_repository_impl.dart';
import 'domain/repositories/forgot_password_repository.dart';
import 'domain/usecases/forgot_password_usecase.dart';

final forgotPasswordRepositoryProvider = Provider<ForgotPasswordRepository>(
  (ref) => ForgotPasswordRepositoryImpl(ref.read(apiClientProvider)),
);

final forgotPasswordUseCaseProvider = Provider<ForgotPasswordUseCase>(
  (ref) => ForgotPasswordUseCase(ref.read(forgotPasswordRepositoryProvider)),
);
