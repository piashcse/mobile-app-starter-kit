import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/api/mock_data.dart';

class FaqScreen extends StatefulWidget {
  const FaqScreen({super.key});
  @override
  State<FaqScreen> createState() => _FaqScreenState();
}

class _FaqScreenState extends State<FaqScreen> {
  int? _expandedIndex;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('FAQ')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: MockData.faqItems.length,
        itemBuilder: (context, index) {
          final item = MockData.faqItems[index];
          final isExpanded = _expandedIndex == index;
          return AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: isExpanded ? AppColors.primary : AppColors.border),
            ),
            child: InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: () => setState(() => _expandedIndex = isExpanded ? null : index),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(child: Text(item['question'] as String, style: Theme.of(context).textTheme.titleMedium)),
                        Icon(isExpanded ? Icons.remove : Icons.add, color: AppColors.primary),
                      ],
                    ),
                    if (isExpanded) ...[
                      const SizedBox(height: 12),
                      Text(item['answer'] as String, style: Theme.of(context).textTheme.bodyMedium),
                    ],
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
