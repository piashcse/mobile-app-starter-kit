package core.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable

import androidx.compose.foundation.isSystemInDarkTheme

@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
