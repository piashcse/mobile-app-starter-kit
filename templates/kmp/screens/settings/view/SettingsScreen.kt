package features.settings.view

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import core.theme.AppColors

@Composable
fun SettingsScreen(
    onNavigate: (String) -> Unit = {},
) {
    var notifications by remember { mutableStateOf(true) }
    var darkMode by remember { mutableStateOf(true) }
    var biometrics by remember { mutableStateOf(false) }

    LazyColumn(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        item {
            Text("Settings", style = MaterialTheme.typography.headlineLarge, color = AppColors.TextPrimary)
            Spacer(Modifier.height(24.dp))
            Text("PREFERENCES", style = MaterialTheme.typography.bodySmall, color = AppColors.TextMuted)
            Spacer(Modifier.height(8.dp))
        }
        item { ToggleRow("🔔", "Push Notifications", notifications) { notifications = it } }
        item { ToggleRow("🌙", "Dark Mode", darkMode) { darkMode = it } }
        item { ToggleRow("🔒", "Biometric Login", biometrics) { biometrics = it } }
        item {
            Spacer(Modifier.height(24.dp))
            Text("ACCOUNT", style = MaterialTheme.typography.bodySmall, color = AppColors.TextMuted)
            Spacer(Modifier.height(8.dp))
        }
        item { NavRow("🔑", "Change Password") { onNavigate("change-password") } }
        item { NavRow("🛡️", "Privacy Policy") { onNavigate("privacy-policy") } }
        item { NavRow("📄", "Terms of Service") { onNavigate("terms") } }
        item { NavRow("❓", "FAQ") { onNavigate("faq") } }
        item { NavRow("ℹ️", "About") { onNavigate("about") } }
    }
}

@Composable
private fun ToggleRow(icon: String, title: String, value: Boolean, onChanged: (Boolean) -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Row { Text("$icon  ", style = MaterialTheme.typography.titleMedium); Text(title, color = AppColors.TextPrimary) }
        Switch(checked = value, onCheckedChange = onChanged, colors = SwitchDefaults.colors(checkedThumbColor = AppColors.Primary))
    }
}

@Composable
private fun NavRow(icon: String, title: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onClick).padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Row { Text("$icon  ", style = MaterialTheme.typography.titleMedium); Text(title, color = AppColors.TextPrimary) }
        Text("›", style = MaterialTheme.typography.headlineSmall, color = AppColors.TextMuted)
    }
}
