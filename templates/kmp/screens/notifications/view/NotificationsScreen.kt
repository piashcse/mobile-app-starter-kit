package features.notifications.view

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import core.theme.AppColors
import core.viewmodel.UiState
import features.notifications.viewmodel.NotificationsViewModel
import di.ViewModelProvider

@Composable
fun NotificationsScreen() {
    val viewModel = remember { ViewModelProvider.notificationsViewModel }
    val state by viewModel.state.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Notifications", style = MaterialTheme.typography.headlineLarge, color = AppColors.TextPrimary)
        Spacer(Modifier.height(16.dp))

        when (val s = state) {
            is UiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator(color = AppColors.Primary) }
            is UiState.Success -> {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(s.data) { item ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = AppColors.Surface,
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Surface(modifier = Modifier.size(8.dp), shape = CircleShape, color = when (item.type) {
                                        "success" -> AppColors.Success; "warning" -> AppColors.Warning; "error" -> AppColors.Error; else -> AppColors.Info
                                    }) {}
                                    Spacer(Modifier.width(8.dp))
                                    Text(item.title, style = MaterialTheme.typography.titleMedium, color = AppColors.TextPrimary, modifier = Modifier.weight(1f))
                                    if (!item.read) Surface(Modifier.size(8.dp), shape = CircleShape, color = AppColors.Primary) {}
                                }
                                Spacer(Modifier.height(8.dp))
                                Text(item.body, style = MaterialTheme.typography.bodyMedium, color = AppColors.TextSecondary)
                                Spacer(Modifier.height(4.dp))
                                Text(item.createdAt, style = MaterialTheme.typography.bodySmall, color = AppColors.TextMuted)
                            }
                        }
                    }
                }
            }
            else -> {}
        }
    }
}
