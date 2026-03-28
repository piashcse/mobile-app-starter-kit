package features.profile.view

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import core.components.AppButton
import core.components.AppCard
import core.theme.AppColors
import core.viewmodel.UiState
import features.profile.viewmodel.ProfileViewModel
import di.ViewModelProvider

@Composable
fun ProfileScreen() {
    val viewModel = remember { ViewModelProvider.profileViewModel }
    val state by viewModel.state.collectAsState()

    when (val s = state) {
        is UiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = AppColors.Primary)
        }
        is UiState.Error -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text(s.message, color = AppColors.Error)
        }
        is UiState.Success -> {
            val profile = s.data
            Column(
                modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                // Avatar placeholder
                Surface(
                    modifier = Modifier.size(100.dp).clip(CircleShape),
                    color = AppColors.Primary,
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(profile.name.take(2).uppercase(), style = MaterialTheme.typography.headlineMedium, color = AppColors.TextPrimary)
                    }
                }
                Spacer(Modifier.height(16.dp))
                Text(profile.name, style = MaterialTheme.typography.headlineMedium, color = AppColors.TextPrimary)
                Text(profile.email, style = MaterialTheme.typography.bodyMedium, color = AppColors.TextSecondary)
                profile.bio?.let {
                    Spacer(Modifier.height(8.dp))
                    Text(it, style = MaterialTheme.typography.bodySmall, color = AppColors.TextMuted)
                }

                Spacer(Modifier.height(24.dp))
                AppCard {
                    InfoRow("📧", "Email", profile.email)
                    HorizontalDivider(color = AppColors.Border)
                    InfoRow("📱", "Phone", profile.phone ?: "Not set")
                    HorizontalDivider(color = AppColors.Border)
                    InfoRow("📍", "Location", profile.location ?: "Not set")
                }

                Spacer(Modifier.height(16.dp))
                AppButton(text = "Edit Profile", onClick = {}, isOutlined = true)
            }
        }
        else -> {}
    }
}

@Composable
private fun InfoRow(icon: String, label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(icon, style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.width(12.dp))
        Column {
            Text(label, style = MaterialTheme.typography.bodySmall, color = AppColors.TextMuted)
            Text(value, style = MaterialTheme.typography.bodyLarge, color = AppColors.TextPrimary)
        }
    }
}
