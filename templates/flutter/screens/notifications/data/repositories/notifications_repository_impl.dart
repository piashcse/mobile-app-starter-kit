import '../../../../core/api/mock_data.dart';
import '../../domain/entities/app_notification.dart';
import '../../domain/repositories/notifications_repository.dart';

class NotificationsRepositoryImpl implements NotificationsRepository {
  const NotificationsRepositoryImpl();

  @override
  Future<List<AppNotification>> getNotifications() async {
    return MockData.notifications.map((item) {
      return AppNotification(
        id: item['id'] as int,
        title: item['title'] as String,
        body: item['body'] as String,
        read: item['read'] as bool,
        createdAt: item['createdAt'] as String,
        type: item['type'] as String,
      );
    }).toList(growable: false);
  }
}
