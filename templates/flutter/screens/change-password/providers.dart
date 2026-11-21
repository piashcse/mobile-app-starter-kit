import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api/api_client_provider.dart';
import 'data/repositories/change_password_repository_impl.dart';
import 'domain/repositories/change_password_repository.dart';
import 'domain/usecases/change_password_usecase.dart';

final changePasswordRepositoryProvider = Provider<ChangePasswordRepository>(
  (ref) => ChangePasswordRepositoryImpl(ref.read(apiClientProvider)),
);

final changePasswordUseCaseProvider = Provider<ChangePasswordUseCase>(
  (ref) => ChangePasswordUseCase(ref.read(changePasswordRepositoryProvider)),
);
