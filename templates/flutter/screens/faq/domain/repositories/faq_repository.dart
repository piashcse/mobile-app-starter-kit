import '../entities/faq_item.dart';

abstract interface class FaqRepository {
  Future<List<FaqItem>> getFaqItems();
}
