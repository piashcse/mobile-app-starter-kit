package features.terms.view

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import core.api.MockData
import core.theme.AppColors

@Composable
fun TermsScreen() {
    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp)) {
        Text(MockData.terms, style = MaterialTheme.typography.bodyMedium, color = AppColors.TextSecondary, lineHeight = MaterialTheme.typography.bodyLarge.lineHeight)
    }
}
