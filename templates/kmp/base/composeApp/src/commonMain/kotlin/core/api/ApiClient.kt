package core.api

import core.error.AppError
import core.error.AppException

/**
 * Mock API client. Replace these methods with Ktor calls when connecting a real
 * backend. It returns typed errors and never contains user-facing copy.
 */
class ApiClient {
    suspend fun login(email: String, password: String): Result<LoginResponse> {
        kotlinx.coroutines.delay(800)
        return if (email == "test@example.com" && password == "password") {
            Result.success(MockData.loginSuccess)
        } else {
            Result.failure(AppException(AppError.InvalidCredentials))
        }
    }

    suspend fun register(
        name: String,
        email: String,
        password: String,
    ): Result<Unit> {
        kotlinx.coroutines.delay(800)
        return Result.success(Unit)
    }

    suspend fun forgotPassword(email: String): Result<Unit> {
        kotlinx.coroutines.delay(800)
        return Result.success(Unit)
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

    suspend fun changePassword(
        current: String,
        newPass: String,
    ): Result<Unit> {
        kotlinx.coroutines.delay(800)
        return Result.success(Unit)
    }
}
