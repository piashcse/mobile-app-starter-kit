import '../../../../core/api/mock_data.dart';
import '../../domain/entities/faq_item.dart';
import '../../domain/repositories/faq_repository.dart';

class FaqRepositoryImpl implements FaqRepository {
  const FaqRepositoryImpl();

  @override
  Future<List<FaqItem>> getFaqItems() async {
    return MockData.faqItems.map((item) {
      return FaqItem(
        id: item['id'] as int,
        question: item['question'] as String,
        answer: item['answer'] as String,
      );
    }).toList(growable: false);
  }
}
