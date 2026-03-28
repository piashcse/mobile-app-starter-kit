package features.signin.view

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import core.components.AppButton
import core.components.AppGhostButton
import core.components.AppInput
import core.theme.AppColors
import core.viewmodel.UiState
import features.signin.viewmodel.SignInViewModel
import di.ViewModelProvider

@Composable
fun SignInScreen(
    onNavigateToSignUp: () -> Unit = {},
    onNavigateToForgotPassword: () -> Unit = {},
    onSignInSuccess: () -> Unit = {},
) {
    val viewModel = remember { ViewModelProvider.signInViewModel }
    val state by viewModel.state.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("👋", style = MaterialTheme.typography.displayLarge)
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            "Welcome Back",
            style = MaterialTheme.typography.headlineLarge,
            color = AppColors.TextPrimary,
        )
        Spacer(modifier = Modifier.height(8.dp))

        Text(
            "Sign in to continue to your account",
            style = MaterialTheme.typography.bodyMedium,
            color = AppColors.TextSecondary,
        )
        Spacer(modifier = Modifier.height(32.dp))

        AppInput(
            value = state.email,
            onValueChange = viewModel::updateEmail,
            label = "Email",
            placeholder = "Enter your email",
            keyboardType = KeyboardType.Email,
        )

        AppInput(
            value = state.password,
            onValueChange = viewModel::updatePassword,
            label = "Password",
            placeholder = "Enter your password",
            isPassword = true,
        )

        if (state.loginState is UiState.Error) {
            Text(
                (state.loginState as UiState.Error).message,
                color = AppColors.Error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(bottom = 16.dp),
            )
        }

        AppButton(
            text = "Sign In",
            onClick = { viewModel.signIn(onSignInSuccess) },
            isLoading = state.loginState is UiState.Loading,
        )

        AppGhostButton(
            text = "Forgot Password?",
            onClick = onNavigateToForgotPassword,
        )

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("Don't have an account?", color = AppColors.TextSecondary)
            AppGhostButton(text = "Sign Up", onClick = onNavigateToSignUp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Surface(
            color = AppColors.Surface,
            shape = RoundedCornerShape(12.dp),
        ) {
            Text(
                "Demo: test@example.com / password",
                style = MaterialTheme.typography.bodySmall,
                color = AppColors.TextMuted,
                modifier = Modifier.padding(12.dp),
                textAlign = TextAlign.Center,
            )
        }
    }
}
