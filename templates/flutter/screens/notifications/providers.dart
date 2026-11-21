import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'data/repositories/notifications_repository_impl.dart';
import 'domain/entities/app_notification.dart';
import 'domain/repositories/notifications_repository.dart';
import 'domain/usecases/get_notifications_usecase.dart';

final notificationsRepositoryProvider = Provider<NotificationsRepository>(
  (ref) => const NotificationsRepositoryImpl(),
);

final getNotificationsUseCaseProvider = Provider<GetNotificationsUseCase>(
  (ref) => GetNotificationsUseCase(ref.read(notificationsRepositoryProvider)),
);

final notificationsProvider = FutureProvider<List<AppNotification>>(
  (ref) => ref.read(getNotificationsUseCaseProvider)(),
);
