package features.about.view

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import core.components.AppButton
import core.components.AppCard
import core.theme.AppColors

@Composable
fun AboutScreen() {
    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("📱", style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(16.dp))
        Text("{{projectName}}", style = MaterialTheme.typography.headlineLarge, color = AppColors.TextPrimary)
        Text("Version 1.0.0", style = MaterialTheme.typography.bodySmall, color = AppColors.TextMuted)
        Spacer(Modifier.height(24.dp))

        AppCard {
            Text("A modern mobile app built with Compose Multiplatform and MVVM architecture.", color = AppColors.TextSecondary)
        }
        Spacer(Modifier.height(16.dp))

        AppCard {
            Row(Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
                Text("🌐  ", style = MaterialTheme.typography.titleMedium)
                Column { Text("Website", style = MaterialTheme.typography.bodySmall, color = AppColors.TextMuted); Text("https://example.com", color = AppColors.TextPrimary) }
            }
            HorizontalDivider(color = AppColors.Border)
            Row(Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
                Text("📧  ", style = MaterialTheme.typography.titleMedium)
                Column { Text("Support", style = MaterialTheme.typography.bodySmall, color = AppColors.TextMuted); Text("support@example.com", color = AppColors.TextPrimary) }
            }
        }
    }
}
