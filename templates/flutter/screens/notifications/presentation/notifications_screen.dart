import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/api/mock_data.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  Color _typeColor(String type) {
    switch (type) {
      case 'success': return AppColors.success;
      case 'warning': return AppColors.warning;
      case 'error': return AppColors.error;
      default: return AppColors.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: MockData.notifications.length,
        itemBuilder: (context, index) {
          final item = MockData.notifications[index];
          final isRead = item['read'] as bool;
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: isRead ? null : const Border(left: BorderSide(color: AppColors.primary, width: 3)),
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  Container(width: 8, height: 8, decoration: BoxDecoration(shape: BoxShape.circle, color: _typeColor(item['type'] as String))),
                  const SizedBox(width: 8),
                  Expanded(child: Text(item['title'] as String, style: Theme.of(context).textTheme.titleMedium)),
                  if (!isRead) Container(width: 8, height: 8, decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.primary)),
                ]),
                const SizedBox(height: 8),
                Text(item['body'] as String, style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 8),
                Text(item['createdAt'] as String, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          );
        },
      ),
    );
  }
}
