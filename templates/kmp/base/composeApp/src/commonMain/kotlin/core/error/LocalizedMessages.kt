package core.error

import androidx.compose.runtime.Composable
import app.generated.resources.Res
import app.generated.resources.auth_sign_in_error_invalid_credentials
import app.generated.resources.common_error_generic
import app.generated.resources.common_error_network
import app.generated.resources.common_error_not_found
import app.generated.resources.validation_current_password_required
import app.generated.resources.validation_email_invalid
import app.generated.resources.validation_email_required
import app.generated.resources.validation_name_required
import app.generated.resources.validation_password_required
import app.generated.resources.validation_password_too_short
import app.generated.resources.validation_passwords_do_not_match
import org.jetbrains.compose.resources.stringResource

/** Maps a typed error to localized copy at the presentation boundary. */
@Composable
fun AppError.localized(): String = when (this) {
    AppError.InvalidCredentials ->
        stringResource(Res.string.auth_sign_in_error_invalid_credentials)
    AppError.Network -> stringResource(Res.string.common_error_network)
    AppError.NotFound -> stringResource(Res.string.common_error_not_found)
    is AppError.Server, is AppError.Unexpected ->
        stringResource(Res.string.common_error_generic)
    is AppError.Validation -> when (reason) {
        ValidationReason.NameRequired ->
            stringResource(Res.string.validation_name_required)
        ValidationReason.EmailRequired ->
            stringResource(Res.string.validation_email_required)
        ValidationReason.EmailInvalid ->
            stringResource(Res.string.validation_email_invalid)
        ValidationReason.PasswordRequired ->
            stringResource(Res.string.validation_password_required)
        ValidationReason.PasswordTooShort ->
            stringResource(Res.string.validation_password_too_short)
        ValidationReason.PasswordsDoNotMatch ->
            stringResource(Res.string.validation_passwords_do_not_match)
        ValidationReason.CurrentPasswordRequired ->
            stringResource(Res.string.validation_current_password_required)
    }
}
