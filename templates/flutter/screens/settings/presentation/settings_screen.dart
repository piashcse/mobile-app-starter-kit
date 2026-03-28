import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notifications = true;
  bool _darkMode = true;
  bool _biometrics = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _sectionTitle('Preferences'),
          _toggleTile('Push Notifications', '🔔', _notifications, (v) => setState(() => _notifications = v)),
          _toggleTile('Dark Mode', '🌙', _darkMode, (v) => setState(() => _darkMode = v)),
          _toggleTile('Biometric Login', '🔒', _biometrics, (v) => setState(() => _biometrics = v)),
          const SizedBox(height: 24),
          _sectionTitle('Account'),
          _navTile('Change Password', '🔑', () => context.push('/change-password')),
          _navTile('Privacy Policy', '🛡️', () => context.push('/privacy-policy')),
          _navTile('Terms of Service', '📄', () => context.push('/terms')),
          _navTile('FAQ', '❓', () => context.push('/faq')),
          _navTile('About', 'ℹ️', () => context.push('/about')),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title) => Padding(
    padding: const EdgeInsets.only(bottom: 8, left: 4),
    child: Text(title, style: Theme.of(context).textTheme.bodySmall?.copyWith(letterSpacing: 1, fontWeight: FontWeight.w600)),
  );

  Widget _toggleTile(String title, String icon, bool value, ValueChanged<bool> onChanged) => ListTile(
    leading: Text(icon, style: const TextStyle(fontSize: 20)),
    title: Text(title),
    trailing: Switch(value: value, onChanged: onChanged, activeColor: AppColors.primary),
    contentPadding: const EdgeInsets.symmetric(horizontal: 8),
  );

  Widget _navTile(String title, String icon, VoidCallback onTap) => ListTile(
    leading: Text(icon, style: const TextStyle(fontSize: 20)),
    title: Text(title),
    trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
    onTap: onTap,
    contentPadding: const EdgeInsets.symmetric(horizontal: 8),
  );
}
