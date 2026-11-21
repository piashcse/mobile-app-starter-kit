package core.i18n

import androidx.compose.runtime.Composable
import androidx.compose.runtime.ProvidedValue
import androidx.compose.runtime.staticCompositionLocalOf
import platform.Foundation.NSUserDefaults

actual object LocalAppLocale {
    private const val languageKey = "AppleLanguages"

    private val localLocale = staticCompositionLocalOf { systemLanguage() }

    actual val current: String
        @Composable get() = localLocale.current

    @Composable
    actual infix fun provides(value: String?): ProvidedValue<*> {
        val defaults = NSUserDefaults.standardUserDefaults
        val newLocale = value ?: systemLanguage()

        if (value == null) {
            defaults.removeObjectForKey(languageKey)
        } else {
            defaults.setObject(listOf(newLocale), forKey = languageKey)
        }

        return localLocale.provides(newLocale)
    }
}
