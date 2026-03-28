package features.signup.view

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import core.components.AppButton
import core.components.AppInput
import core.theme.AppColors
import core.viewmodel.UiState
import features.signup.viewmodel.SignUpViewModel
import di.ViewModelProvider

@Composable
fun SignUpScreen(onSuccess: () -> Unit = {}) {
    val viewModel = remember { ViewModelProvider.signUpViewModel }
    val state by viewModel.state.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("🚀", style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(16.dp))
        Text("Create Account", style = MaterialTheme.typography.headlineLarge, color = AppColors.TextPrimary)
        Spacer(Modifier.height(32.dp))

        AppInput(value = state.name, onValueChange = viewModel::updateName, label = "Full Name", placeholder = "Enter your name")
        AppInput(value = state.email, onValueChange = viewModel::updateEmail, label = "Email", placeholder = "Enter your email", keyboardType = KeyboardType.Email)
        AppInput(value = state.password, onValueChange = viewModel::updatePassword, label = "Password", placeholder = "Create a password", isPassword = true)
        AppInput(value = state.confirmPassword, onValueChange = viewModel::updateConfirmPassword, label = "Confirm Password", placeholder = "Confirm password", isPassword = true)

        if (state.registerState is UiState.Error) {
            Text((state.registerState as UiState.Error).message, color = AppColors.Error, modifier = Modifier.padding(bottom = 16.dp))
        }

        AppButton(text = "Create Account", onClick = { viewModel.signUp(onSuccess) }, isLoading = state.registerState is UiState.Loading)
    }
}
