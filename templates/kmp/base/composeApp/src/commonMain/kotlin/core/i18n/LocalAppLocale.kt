package core.i18n

import androidx.compose.runtime.Composable
import androidx.compose.runtime.ProvidedValue

/**
 * Official Compose Multiplatform pattern for overriding the resource locale at
 * runtime. See "Manage local resource environment" in the Kotlin docs.
 */
expect object LocalAppLocale {
    val current: String
        @Composable get

    @Composable
    infix fun provides(value: String?): ProvidedValue<*>
}
