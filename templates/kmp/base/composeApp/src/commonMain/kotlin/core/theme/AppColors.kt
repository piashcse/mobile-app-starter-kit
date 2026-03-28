package core.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

object AppColors {
    val Primary = Color(0xFF6366F1)
    val PrimaryLight = Color(0xFF818CF8)
    val PrimaryDark = Color(0xFF4F46E5)

    val Background = Color(0xFF0F172A)
    val Surface = Color(0xFF1E293B)
    val SurfaceLight = Color(0xFF334155)

    val TextPrimary = Color(0xFFF8FAFC)
    val TextSecondary = Color(0xFF94A3B8)
    val TextMuted = Color(0xFF64748B)

    val Accent = Color(0xFF06B6D4)
    val Success = Color(0xFF10B981)
    val Warning = Color(0xFFF59E0B)
    val Error = Color(0xFFEF4444)
    val Info = Color(0xFF3B82F6)

    val Border = Color(0xFF334155)

    val GradientStart = Color(0xFF6366F1)
    val GradientEnd = Color(0xFF8B5CF6)
    
    // Light equivalents
    val BackgroundLight = Color(0xFFF8FAFC)
    val SurfaceLightCard = Color(0xFFFFFFFF)
    val TextPrimaryLight = Color(0xFF0F172A)
    val TextSecondaryLight = Color(0xFF475569)
}

val LightColorScheme = lightColorScheme(
    primary = AppColors.Primary,
    secondary = AppColors.Accent,
    background = AppColors.BackgroundLight,
    surface = AppColors.SurfaceLightCard,
    error = AppColors.Error,
    onPrimary = Color.White,
    onBackground = AppColors.TextPrimaryLight,
    onSurface = AppColors.TextPrimaryLight,
    onError = Color.White,
)

val DarkColorScheme = darkColorScheme(
    primary = AppColors.Primary,
    secondary = AppColors.Accent,
    background = AppColors.Background,
    surface = AppColors.Surface,
    error = AppColors.Error,
    onPrimary = AppColors.TextPrimary,
    onBackground = AppColors.TextPrimary,
    onSurface = AppColors.TextPrimary,
    onError = AppColors.TextPrimary,
)
