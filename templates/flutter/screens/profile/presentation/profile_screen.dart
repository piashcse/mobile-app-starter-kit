import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/widgets.dart';
import 'profile_controller.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(profileControllerProvider);

    if (state.isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final profile = state.profile;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            CircleAvatar(
              radius: 50,
              backgroundImage: CachedNetworkImageProvider(
                profile?['avatar'] ?? 'https://i.pravatar.cc/150?img=68',
              ),
            ),
            const SizedBox(height: 16),
            Text(profile?['name'] ?? 'User', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 4),
            Text(profile?['email'] ?? '', style: Theme.of(context).textTheme.bodyMedium),
            if (profile?['bio'] != null) ...[
              const SizedBox(height: 8),
              Text(profile!['bio'], style: Theme.of(context).textTheme.bodySmall, textAlign: TextAlign.center),
            ],
            const SizedBox(height: 24),
            AppCard(
              child: Column(
                children: [
                  _infoRow(context, '📧', 'Email', profile?['email'] ?? ''),
                  const Divider(color: AppColors.border, height: 1),
                  _infoRow(context, '📱', 'Phone', profile?['phone'] ?? 'Not set'),
                  const Divider(color: AppColors.border, height: 1),
                  _infoRow(context, '📍', 'Location', profile?['location'] ?? 'Not set'),
                ],
              ),
            ),
            const SizedBox(height: 16),
            AppButton(title: 'Edit Profile', onPressed: () {}, isOutlined: true),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(BuildContext context, String icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Text(icon, style: const TextStyle(fontSize: 20)),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: Theme.of(context).textTheme.bodySmall),
              Text(value, style: Theme.of(context).textTheme.bodyLarge),
            ],
          ),
        ],
      ),
    );
  }
}
