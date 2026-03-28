package features.faq.view

import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import core.theme.AppColors
import core.viewmodel.UiState
import features.faq.viewmodel.FaqViewModel
import di.ViewModelProvider

@Composable
fun FaqScreen() {
    val viewModel = remember { ViewModelProvider.faqViewModel }
    val state by viewModel.state.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("❓", style = MaterialTheme.typography.displaySmall, modifier = Modifier.align(Alignment.CenterHorizontally))
        Spacer(Modifier.height(8.dp))
        Text("FAQ", style = MaterialTheme.typography.headlineMedium, color = AppColors.TextPrimary, modifier = Modifier.align(Alignment.CenterHorizontally))
        Spacer(Modifier.height(16.dp))

        when (val items = state.items) {
            is UiState.Loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator(color = AppColors.Primary) }
            is UiState.Success -> {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(items.data) { item ->
                        val isExpanded = state.expandedId == item.id
                        Surface(
                            modifier = Modifier.fillMaxWidth().animateContentSize().clickable { viewModel.toggleExpand(item.id) },
                            shape = RoundedCornerShape(12.dp),
                            color = AppColors.Surface,
                            border = if (isExpanded) androidx.compose.foundation.BorderStroke(1.dp, AppColors.Primary) else null,
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(item.question, style = MaterialTheme.typography.titleMedium, color = AppColors.TextPrimary, modifier = Modifier.weight(1f))
                                    Text(if (isExpanded) "−" else "+", color = AppColors.Primary, style = MaterialTheme.typography.headlineSmall)
                                }
                                if (isExpanded) {
                                    Spacer(Modifier.height(12.dp))
                                    Text(item.answer, style = MaterialTheme.typography.bodyMedium, color = AppColors.TextSecondary)
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
