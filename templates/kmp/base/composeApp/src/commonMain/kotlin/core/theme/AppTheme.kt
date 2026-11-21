package core.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import core.i18n.LocalAppLocale
import core.i18n.LocalLocaleController
import core.i18n.LocaleController

class AppThemeController(initialDark: Boolean) {
    var isDark by mutableStateOf(initialDark)
}

val LocalAppThemeController = staticCompositionLocalOf<AppThemeController> {
    error("AppThemeController is only available inside AppTheme")
}

@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val themeController = remember { AppThemeController(darkTheme) }
    val localeController = remember { LocaleController() }
    val colorScheme = if (themeController.isDark) DarkColorScheme else LightColorScheme

    CompositionLocalProvider(
        LocalAppLocale provides localeController.locale,
        LocalAppThemeController provides themeController,
        LocalLocaleController provides localeController,
    ) {
        key(localeController.locale) {
            MaterialTheme(
                colorScheme = colorScheme,
                typography = AppTypography,
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background,
                    content = content,
                )
            }
        }
    }
}
