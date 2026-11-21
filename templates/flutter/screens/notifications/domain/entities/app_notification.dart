class AppNotification {
  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.read,
    required this.createdAt,
    required this.type,
  });

  final int id;
  final String title;
  final String body;
  final bool read;
  final String createdAt;
  final String type;
}
