package features.forgotpassword.view

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import core.components.AppButton
import core.components.AppGhostButton
import core.components.AppInput
import core.theme.AppColors
import core.viewmodel.UiState
import features.forgotpassword.viewmodel.ForgotPasswordViewModel
import di.ViewModelProvider

@Composable
fun ForgotPasswordScreen(onBack: () -> Unit = {}) {
    val viewModel = remember { ViewModelProvider.forgotPasswordViewModel }
    val email by viewModel.email.collectAsState()
    val state by viewModel.state.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("🔐", style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(16.dp))
        Text("Forgot Password?", style = MaterialTheme.typography.headlineLarge, color = AppColors.TextPrimary)
        Spacer(Modifier.height(8.dp))
        Text("Enter your email to receive a reset link.", color = AppColors.TextSecondary)
        Spacer(Modifier.height(32.dp))

        AppInput(value = email, onValueChange = viewModel::updateEmail, label = "Email", placeholder = "Enter your email", keyboardType = KeyboardType.Email)
        AppButton(text = "Send Reset Link", onClick = { viewModel.submit(onBack) }, isLoading = state is UiState.Loading)
        AppGhostButton(text = "Back to Sign In", onClick = onBack)
    }
}
