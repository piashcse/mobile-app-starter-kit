package core.error

/** Typed, presentation-agnostic error hierarchy. */
sealed interface AppError {
    data object InvalidCredentials : AppError
    data object Network : AppError
    data object NotFound : AppError
    data class Server(val code: Int? = null) : AppError
    data class Unexpected(val debugMessage: String? = null) : AppError
    data class Validation(val reason: ValidationReason) : AppError
}

enum class ValidationReason {
    NameRequired,
    EmailRequired,
    EmailInvalid,
    PasswordRequired,
    PasswordTooShort,
    PasswordsDoNotMatch,
    CurrentPasswordRequired,
}

class AppException(val error: AppError) : Exception()

fun Throwable.toAppError(): AppError =
    (this as? AppException)?.error ?: AppError.Unexpected(message)
