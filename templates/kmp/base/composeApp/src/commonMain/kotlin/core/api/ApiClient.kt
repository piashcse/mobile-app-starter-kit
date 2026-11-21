package core.api

import core.config.AppConfig
import core.error.AppError
import core.error.AppException
import core.observability.AppLogger
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

/**
 * Mock-first API client with an opt-in remote mode. Replace the mock branches
 * with real endpoints when connecting a backend.
 */
class ApiClient {
    private val json = Json { ignoreUnknownKeys = true }

    private val client by lazy {
        HttpClient {
            install(ContentNegotiation) {
                json(json)
            }
        }
    }

    suspend fun login(email: String, password: String): Result<LoginResponse> {
        if (AppConfig.useMockApi) {
            kotlinx.coroutines.delay(800)
            return if (email == "test@example.com" && password == "password") {
                Result.success(MockData.loginSuccess)
            } else {
                Result.failure(AppException(AppError.InvalidCredentials))
            }
        }

        return remote {
            val response = client.post("${AppConfig.apiBaseUrl}/auth/login") {
                contentType(ContentType.Application.Json)
                setBody(LoginRequest(email, password))
            }
            if (!response.status.isSuccess()) {
                throw AppException(AppError.Server(response.status.value))
            }
            response.body()
        }
    }

    suspend fun register(
        name: String,
        email: String,
        password: String,
    ): Result<Unit> {
        if (AppConfig.useMockApi) {
            kotlinx.coroutines.delay(800)
            return Result.success(Unit)
        }
        return remote {
            val response = client.post("${AppConfig.apiBaseUrl}/auth/register") {
                contentType(ContentType.Application.Json)
                setBody(RegisterRequest(name, email, password))
            }
            if (!response.status.isSuccess()) {
                throw AppException(AppError.Server(response.status.value))
            }
        }
    }

    suspend fun forgotPassword(email: String): Result<Unit> {
        if (AppConfig.useMockApi) {
            kotlinx.coroutines.delay(800)
            return Result.success(Unit)
        }
        return remote {
            val response = client.post("${AppConfig.apiBaseUrl}/auth/forgot-password") {
                contentType(ContentType.Application.Json)
                setBody(mapOf("email" to email))
            }
            if (!response.status.isSuccess()) {
                throw AppException(AppError.Server(response.status.value))
            }
        }
    }

    suspend fun getProfile(): Result<UserProfile> {
        if (AppConfig.useMockApi) {
            kotlinx.coroutines.delay(500)
            return Result.success(MockData.userProfile)
        }
        return remote {
            val response = client.get("${AppConfig.apiBaseUrl}/user/profile")
            if (!response.status.isSuccess()) {
                throw AppException(AppError.Server(response.status.value))
            }
            response.body()
        }
    }

    suspend fun getFaqItems(): Result<List<FaqItem>> {
        if (AppConfig.useMockApi) {
            kotlinx.coroutines.delay(500)
            return Result.success(MockData.faqItems)
        }
        return remote {
            val response = client.get("${AppConfig.apiBaseUrl}/faq")
            if (!response.status.isSuccess()) {
                throw AppException(AppError.Server(response.status.value))
            }
            response.body()
        }
    }

    suspend fun getNotifications(): Result<List<NotificationItem>> {
        if (AppConfig.useMockApi) {
            kotlinx.coroutines.delay(500)
            return Result.success(MockData.notifications)
        }
        return remote {
            val response = client.get("${AppConfig.apiBaseUrl}/notifications")
            if (!response.status.isSuccess()) {
                throw AppException(AppError.Server(response.status.value))
            }
            response.body()
        }
    }

    suspend fun changePassword(
        current: String,
        newPass: String,
    ): Result<Unit> {
        if (AppConfig.useMockApi) {
            kotlinx.coroutines.delay(800)
            return Result.success(Unit)
        }
        return remote {
            val response = client.post("${AppConfig.apiBaseUrl}/auth/change-password") {
                contentType(ContentType.Application.Json)
                setBody(ChangePasswordRequest(current, newPass))
            }
            if (!response.status.isSuccess()) {
                throw AppException(AppError.Server(response.status.value))
            }
        }
    }

    private suspend inline fun <T> remote(block: () -> T): Result<T> {
        AppLogger.debug("API request")
        return try {
            Result.success(block())
        } catch (error: AppException) {
            AppLogger.error("API error", error)
            Result.failure(error)
        } catch (error: Exception) {
            AppLogger.error("Network error", error)
            Result.failure(AppException(AppError.Network))
        }
    }
}
