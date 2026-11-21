package core.i18n

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf

class LocaleController {
    var locale by mutableStateOf(loadStoredLocale() ?: systemLanguage())
        private set

    fun selectLocale(code: String) {
        locale = code
        saveStoredLocale(code)
    }
}

val LocalLocaleController = staticCompositionLocalOf<LocaleController> {
    error("LocaleController is only available inside AppTheme")
}
