package core.validation

import core.error.ValidationReason
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class ValidatorsTest {
    @Test
    fun requiresAName() {
        assertEquals(ValidationReason.NameRequired, validateName(" "))
        assertNull(validateName("Ada"))
    }

    @Test
    fun validatesEmails() {
        assertEquals(ValidationReason.EmailRequired, validateEmail(""))
        assertEquals(ValidationReason.EmailInvalid, validateEmail("not-an-email"))
        assertNull(validateEmail("test@example.com"))
    }

    @Test
    fun validatesPasswords() {
        assertEquals(ValidationReason.PasswordRequired, validatePassword(""))
        assertEquals(ValidationReason.PasswordTooShort, validatePassword("123"))
        assertNull(validatePassword("password"))
    }

    @Test
    fun validatesConfirmation() {
        assertEquals(
            ValidationReason.PasswordsDoNotMatch,
            validatePasswordConfirmation("password", "different"),
        )
        assertNull(validatePasswordConfirmation("password", "password"))
    }
}
