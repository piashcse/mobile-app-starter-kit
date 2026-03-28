class MockData {
  MockData._();

  static final loginSuccess = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-jwt-token',
    'user': {
      'id': 1,
      'name': 'John Doe',
      'email': 'test@example.com',
      'avatar': 'https://i.pravatar.cc/150?img=68',
    },
  };

  static final loginError = {
    'message': 'Invalid email or password. Please try again.',
  };

  static final registerSuccess = {
    'message': 'Account created successfully! Please sign in.',
  };

  static final forgotPasswordSuccess = {
    'message': 'Password reset link has been sent to your email.',
  };

  static final userProfile = {
    'id': 1,
    'name': 'John Doe',
    'email': 'john@example.com',
    'avatar': 'https://i.pravatar.cc/150?img=68',
    'phone': '+1 (555) 123-4567',
    'bio': 'Mobile developer & tech enthusiast.',
    'location': 'San Francisco, CA',
    'joinedDate': '2024-01-15',
  };

  static final updateProfileSuccess = {
    'message': 'Profile updated successfully!',
  };

  static final faqItems = [
    {
      'id': 1,
      'question': 'How do I reset my password?',
      'answer': 'Navigate to Sign In and tap "Forgot Password". Enter your email and we\'ll send a reset link.',
    },
    {
      'id': 2,
      'question': 'How do I update my profile?',
      'answer': 'Go to Profile and tap Edit. You can update your name, email, phone, and avatar.',
    },
    {
      'id': 3,
      'question': 'How do I contact support?',
      'answer': 'Email us at support@example.com or use the in-app chat from Settings.',
    },
    {
      'id': 4,
      'question': 'Is my data secure?',
      'answer': 'Yes! We use AES-256 encryption for data at rest and TLS 1.3 for data in transit.',
    },
    {
      'id': 5,
      'question': 'Can I delete my account?',
      'answer': 'Yes, go to Settings > Account > Delete Account. This action is irreversible.',
    },
  ];

  static final notifications = [
    {
      'id': 1,
      'title': 'Welcome to the App! 🎉',
      'body': 'Thanks for joining! Explore all features.',
      'read': false,
      'createdAt': '2025-03-28T10:00:00Z',
      'type': 'info',
    },
    {
      'id': 2,
      'title': 'Profile Updated',
      'body': 'Your profile information has been updated.',
      'read': true,
      'createdAt': '2025-03-27T14:30:00Z',
      'type': 'success',
    },
    {
      'id': 3,
      'title': 'Security Alert',
      'body': 'A new device signed in to your account.',
      'read': false,
      'createdAt': '2025-03-26T09:15:00Z',
      'type': 'warning',
    },
  ];

  static const privacyPolicy = '''
# Privacy Policy

**Last Updated: March 2025**

## 1. Information We Collect
We collect information you provide directly, such as when you create an account.

## 2. How We Use Your Information
We use information to provide, maintain, and improve our services.

## 3. Data Security
We implement industry-standard security measures including AES-256 encryption.

## 4. Your Rights
You have the right to access, correct, delete, and export your data.

## 5. Contact Us
Questions? Contact us at privacy@example.com.
''';

  static const terms = '''
# Terms of Service

**Last Updated: March 2025**

## 1. Acceptance of Terms
By using our app, you agree to these Terms of Service.

## 2. User Accounts
You are responsible for maintaining your account credentials.

## 3. Acceptable Use
Do not use the service for illegal purposes or unauthorized access.

## 4. Intellectual Property
All content and functionality are owned by us and protected by law.

## 5. Contact
Questions? Email us at legal@example.com.
''';

  static final about = {
    'version': '1.0.0',
    'buildNumber': '1',
    'website': 'https://example.com',
    'supportEmail': 'support@example.com',
    'description': 'A modern mobile app built with Flutter and Clean Architecture.',
  };
}
