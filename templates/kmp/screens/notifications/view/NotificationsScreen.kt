package features.notifications.view

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import app.generated.resources.*
import org.jetbrains.compose.resources.stringResource
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import core.error.localized
import core.theme.AppColors
import core.theme.AppRadii
import core.theme.AppSizes
import core.theme.AppSpacing
import core.viewmodel.UiState
import di.ViewModelProvider

@Composable
fun NotificationsScreen() {
    val viewModel = remember { ViewModelProvider.notificationsViewModel() }
    DisposableEffect(viewModel) { onDispose { viewModel.onCleared() } }
    val state by viewModel.state.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(AppSizes.screenPadding),
    ) {
        Text(
            stringResource(Res.string.notifications_title),
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(AppSpacing.md))

        when (val s = state) {
            is UiState.Loading -> Box(
                Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center,
            ) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
            }
            is UiState.Error -> Box(
                Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    s.error.localized(),
                    color = MaterialTheme.colorScheme.error,
                )
            }
            is UiState.Success -> {
                if (s.data.isEmpty()) {
                    Box(
                        Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            stringResource(Res.string.notifications_empty),
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(AppSpacing.sm),
                    ) {
                        items(s.data) { item ->
                            Surface(
                                shape = RoundedCornerShape(AppRadii.md),
                                color = MaterialTheme.colorScheme.surface,
                            ) {
                                Column(modifier = Modifier.padding(AppSpacing.md)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Surface(
                                            modifier = Modifier.size(AppSpacing.sm),
                                            shape = CircleShape,
                                            color = when (item.type) {
                                                "success" -> AppColors.Success
                                                "warning" -> AppColors.Warning
                                                "error" -> MaterialTheme.colorScheme.error
                                                else -> AppColors.Info
                                            },
                                        ) {}
                                        Spacer(Modifier.width(AppSpacing.sm))
                                        Text(
                                            item.title,
                                            style = MaterialTheme.typography.titleMedium,
                                            color = MaterialTheme.colorScheme.onBackground,
                                            modifier = Modifier.weight(1f),
                                        )
                                        if (!item.read) {
                                            Surface(
                                                Modifier.size(AppSpacing.sm),
                                                shape = CircleShape,
                                                color = MaterialTheme.colorScheme.primary,
                                            ) {}
                                        }
                                    }
                                    Spacer(Modifier.height(AppSpacing.sm))
                                    Text(
                                        item.body,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                    Spacer(Modifier.height(AppSpacing.xs))
                                    Text(
                                        item.createdAt,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                            }
                        }
                    }
                }
            }
            else -> {}
        }
    }
}
