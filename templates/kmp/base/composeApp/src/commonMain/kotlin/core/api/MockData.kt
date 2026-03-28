package core.api

object MockData {
    val loginSuccess = LoginResponse(
        token = "mock-jwt-token",
        user = UserInfo(id = 1, name = "John Doe", email = "test@example.com", avatar = "https://i.pravatar.cc/150?img=68")
    )

    val userProfile = UserProfile(
        id = 1,
        name = "John Doe",
        email = "john@example.com",
        avatar = "https://i.pravatar.cc/150?img=68",
        phone = "+1 (555) 123-4567",
        bio = "Mobile developer & tech enthusiast.",
        location = "San Francisco, CA",
        joinedDate = "2024-01-15"
    )

    val faqItems = listOf(
        FaqItem(1, "How do I reset my password?", "Go to Sign In and tap Forgot Password."),
        FaqItem(2, "How do I update my profile?", "Go to Profile and tap Edit."),
        FaqItem(3, "How do I contact support?", "Email us at support@example.com."),
        FaqItem(4, "Is my data secure?", "Yes! We use AES-256 encryption."),
        FaqItem(5, "Can I delete my account?", "Yes, from Settings > Account > Delete.")
    )

    val notifications = listOf(
        NotificationItem(1, "Welcome! 🎉", "Thanks for joining!", false, "2025-03-28T10:00:00Z", "info"),
        NotificationItem(2, "Profile Updated", "Your profile was updated.", true, "2025-03-27T14:30:00Z", "success"),
        NotificationItem(3, "Security Alert", "New device signed in.", false, "2025-03-26T09:15:00Z", "warning")
    )

    val privacyPolicy = """
        # Privacy Policy
        
        Last Updated: March 2025
        
        We collect information you provide directly. We use industry-standard encryption to protect your data.
        You have the right to access, correct, delete, and export your data.
        Contact: privacy@example.com
    """.trimIndent()

    val terms = """
        # Terms of Service
        
        Last Updated: March 2025
        
        By using our app, you agree to these terms. You are responsible for your account credentials.
        Contact: legal@example.com
    """.trimIndent()
}
