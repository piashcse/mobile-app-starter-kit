package core.validation

import core.error.ValidationReason

private val emailRegex = Regex("^\\S+@\\S+\\.\\S+$")
private const val minPasswordLength = 6

fun validateName(value: String): ValidationReason? =
    if (value.isBlank()) ValidationReason.NameRequired else null

fun validateEmail(value: String): ValidationReason? = when {
    value.isBlank() -> ValidationReason.EmailRequired
    !emailRegex.matches(value.trim()) -> ValidationReason.EmailInvalid
    else -> null
}

fun validateField(
    value: String,
    label: ValidationReason,
): ValidationReason? = if (value.isBlank()) label else null

fun validatePassword(value: String): ValidationReason? = when {
    value.isBlank() -> ValidationReason.PasswordRequired
    value.length < minPasswordLength -> ValidationReason.PasswordTooShort
    else -> null
}

fun validatePasswordConfirmation(
    password: String,
    confirmation: String,
): ValidationReason? = when {
    confirmation.isBlank() -> ValidationReason.PasswordRequired
    password != confirmation -> ValidationReason.PasswordsDoNotMatch
    else -> null
}
