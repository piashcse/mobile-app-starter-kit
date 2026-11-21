package core.i18n

import androidx.compose.runtime.Composable
import androidx.compose.runtime.ProvidedValue
import androidx.compose.runtime.staticCompositionLocalOf
import platform.Foundation.NSUserDefaults

actual object LocalAppLocale {
    private const val LANGUAGE_KEY = "AppleLanguages"

    private val localLocale = staticCompositionLocalOf { systemLanguage() }

    actual val current: String
        @Composable get() = localLocale.current

    @Composable
    actual infix fun provides(value: String?): ProvidedValue<*> {
        val defaults = NSUserDefaults.standardUserDefaults
        val newLocale = value ?: systemLanguage()

        if (value == null) {
            defaults.removeObjectForKey(LANGUAGE_KEY)
        } else {
            defaults.setObject(listOf(newLocale), forKey = LANGUAGE_KEY)
        }

        return localLocale.provides(newLocale)
    }
}
