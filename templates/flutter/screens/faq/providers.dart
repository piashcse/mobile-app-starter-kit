import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'data/repositories/faq_repository_impl.dart';
import 'domain/entities/faq_item.dart';
import 'domain/repositories/faq_repository.dart';
import 'domain/usecases/get_faq_usecase.dart';

final faqRepositoryProvider = Provider<FaqRepository>(
  (ref) => const FaqRepositoryImpl(),
);

final getFaqUseCaseProvider = Provider<GetFaqUseCase>(
  (ref) => GetFaqUseCase(ref.read(faqRepositoryProvider)),
);

final faqItemsProvider = FutureProvider<List<FaqItem>>(
  (ref) => ref.read(getFaqUseCaseProvider)(),
);
