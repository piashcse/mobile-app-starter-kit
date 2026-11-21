export const mockData = {
  auth: {
    login: {
      success: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-jwt-token',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'test@example.com',
          avatar: 'https://i.pravatar.cc/150?img=68',
        },
      },
      error: {
        message: 'Invalid email or password. Please try again.',
      },
    },
    register: {
      success: { message: 'Account created successfully! Please sign in.' },
      error: { message: 'An account with this email already exists.' },
    },
    forgotPassword: {
      success: { message: 'Password reset link has been sent to your email.' },
    },
  },
  user: {
    profile: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?img=68',
      phone: '+1 (555) 123-4567',
      bio: 'Mobile developer & tech enthusiast. Building amazing apps one line at a time.',
      location: 'San Francisco, CA',
      joinedDate: '2024-01-15',
    },
    updateProfile: {
      success: { message: 'Profile updated successfully!' },
    },
  },
  faq: {
    items: [
      {
        id: 1,
        question: 'How do I reset my password?',
        answer:
          'Navigate to the Sign In screen and tap "Forgot Password". Enter your email address and we\'ll send you a reset link.',
      },
      {
        id: 2,
        question: 'How do I update my profile?',
        answer:
          'Go to your Profile screen and tap the "Edit" button. You can update your name, email, phone number, and profile picture.',
      },
      {
        id: 3,
        question: 'How do I contact support?',
        answer:
          'You can reach our support team at support@example.com or through the in-app chat feature available on the Settings screen.',
      },
      {
        id: 4,
        question: 'Is my data secure?',
        answer:
          'Yes! We use industry-standard encryption (AES-256) to protect your data both in transit and at rest. Read our Privacy Policy for more details.',
      },
      {
        id: 5,
        question: 'Can I delete my account?',
        answer:
          'Yes, you can delete your account from Settings > Account > Delete Account. Please note that this action is irreversible.',
      },
      {
        id: 6,
        question: 'What platforms are supported?',
        answer:
          'Our app is available on iOS, Android, and Web. All platforms share the same features and stay in sync.',
      },
    ],
  },
  notifications: {
    items: [
      {
        id: 1,
        title: 'Welcome to the App! 🎉',
        body: 'Thanks for joining! Explore all the features we have in store for you.',
        read: false,
        createdAt: '2025-03-28T10:00:00Z',
        type: 'info',
      },
      {
        id: 2,
        title: 'Profile Updated',
        body: 'Your profile information has been successfully updated.',
        read: true,
        createdAt: '2025-03-27T14:30:00Z',
        type: 'success',
      },
      {
        id: 3,
        title: 'Security Alert',
        body: 'A new device was used to sign in to your account. If this wasn\'t you, please change your password.',
        read: false,
        createdAt: '2025-03-26T09:15:00Z',
        type: 'warning',
      },
      {
        id: 4,
        title: 'New Feature Available',
        body: 'Check out our new dark mode settings! Customize your app experience.',
        read: true,
        createdAt: '2025-03-25T16:45:00Z',
        type: 'info',
      },
    ],
  },
  app: {
    about: {
      version: '1.0.0',
      buildNumber: '1',
      website: 'https://example.com',
      supportEmail: 'support@example.com',
    },
  },
};
