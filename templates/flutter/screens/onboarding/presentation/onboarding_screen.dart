import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/widgets.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  final _slides = const [
    {'emoji': '🚀', 'title': 'Welcome', 'desc': 'Discover a new way to manage your life.'},
    {'emoji': '🔒', 'title': 'Secure & Private', 'desc': 'Your data is encrypted and protected.'},
    {'emoji': '⚡', 'title': 'Fast & Reliable', 'desc': 'Lightning-fast performance.'},
    {'emoji': '🎯', 'title': 'Get Started', 'desc': 'Create your account today!'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            if (_currentPage < _slides.length - 1)
              Align(
                alignment: Alignment.topRight,
                child: TextButton(onPressed: () => context.go('/signin'), child: const Text('Skip')),
              ),
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (i) => setState(() => _currentPage = i),
                itemCount: _slides.length,
                itemBuilder: (context, index) {
                  final slide = _slides[index];
                  return Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(slide['emoji']!, style: const TextStyle(fontSize: 80)),
                        const SizedBox(height: 32),
                        Text(slide['title']!, style: Theme.of(context).textTheme.headlineLarge, textAlign: TextAlign.center),
                        const SizedBox(height: 16),
                        Text(slide['desc']!, style: Theme.of(context).textTheme.bodyMedium, textAlign: TextAlign.center),
                      ],
                    ),
                  );
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_slides.length, (i) => AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 4),
                width: _currentPage == i ? 24 : 8,
                height: 8,
                decoration: BoxDecoration(
                  color: _currentPage == i ? AppColors.primary : AppColors.surfaceLight,
                  borderRadius: BorderRadius.circular(4),
                ),
              )),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: AppButton(
                title: _currentPage == _slides.length - 1 ? 'Get Started' : 'Next',
                onPressed: () {
                  if (_currentPage < _slides.length - 1) {
                    _pageController.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.ease);
                  } else {
                    context.go('/signin');
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
