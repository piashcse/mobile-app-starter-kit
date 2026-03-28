package core.api

import kotlinx.serialization.json.Json

/**
 * Mock API Client that returns hardcoded JSON responses
 * Replace with real Ktor HttpClient when connecting to a real API
 */
class ApiClient {
    private val json = Json { ignoreUnknownKeys = true }

    suspend fun login(email: String, password: String): Result<LoginResponse> {
        kotlinx.coroutines.delay(800)
        return if (email == "test@example.com" && password == "password") {
            Result.success(MockData.loginSuccess)
        } else {
            Result.failure(Exception("Invalid email or password"))
        }
    }

    suspend fun register(name: String, email: String, password: String): Result<String> {
        kotlinx.coroutines.delay(800)
        return Result.success("Account created successfully!")
    }

    suspend fun forgotPassword(email: String): Result<String> {
        kotlinx.coroutines.delay(800)
        return Result.success("Reset link sent to your email")
    }

    suspend fun getProfile(): Result<UserProfile> {
        kotlinx.coroutines.delay(500)
        return Result.success(MockData.userProfile)
    }

    suspend fun getFaqItems(): Result<List<FaqItem>> {
        kotlinx.coroutines.delay(500)
        return Result.success(MockData.faqItems)
    }

    suspend fun getNotifications(): Result<List<NotificationItem>> {
        kotlinx.coroutines.delay(500)
        return Result.success(MockData.notifications)
    }

    suspend fun changePassword(current: String, newPass: String): Result<String> {
        kotlinx.coroutines.delay(800)
        return Result.success("Password changed successfully")
    }
}
