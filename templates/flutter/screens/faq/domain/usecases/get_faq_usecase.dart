import '../entities/faq_item.dart';
import '../repositories/faq_repository.dart';

class GetFaqUseCase {
  const GetFaqUseCase(this._repository);

  final FaqRepository _repository;

  Future<List<FaqItem>> call() => _repository.getFaqItems();
}
