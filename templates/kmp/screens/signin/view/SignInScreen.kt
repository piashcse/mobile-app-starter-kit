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
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import core.components.AppButton
import core.components.AppGhostButton
import core.components.AppInput
import core.i18n.LanguageSwitcher
import core.i18n.LocalStrings
import core.viewmodel.UiState
import features.signin.viewmodel.SignInViewModel
import di.ViewModelProvider

@Composable
fun SignInScreen(
    onNavigateToSignUp: () -> Unit = {},
    onNavigateToForgotPassword: () -> Unit = {},
    onSignInSuccess: () -> Unit = {},
) {
    val viewModel = remember { ViewModelProvider.signInViewModel() }
    DisposableEffect(viewModel) { onDispose { viewModel.onCleared() } }
    val state by viewModel.state.collectAsState()
    val strings = LocalStrings.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            "👋",
            style = MaterialTheme.typography.displayLarge,
            modifier = Modifier.semantics {
                contentDescription = strings.authSignInLogoLabel
            },
        )
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            strings.authSignInTitle,
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(modifier = Modifier.height(8.dp))

        Text(
            strings.authSignInSubtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(modifier = Modifier.height(32.dp))

        AppInput(
            value = state.email,
            onValueChange = viewModel::updateEmail,
            label = strings.authSignInEmailLabel,
            placeholder = strings.authSignInEmailPlaceholder,
            keyboardType = KeyboardType.Email,
        )

        AppInput(
            value = state.password,
            onValueChange = viewModel::updatePassword,
            label = strings.authSignInPasswordLabel,
            placeholder = strings.authSignInPasswordPlaceholder,
            isPassword = true,
            showPasswordLabel = strings.authSignInShowPassword,
            hidePasswordLabel = strings.authSignInHidePassword,
        )

        if (state.loginState is UiState.Error) {
            Text(
                strings.authSignInErrorInvalidCredentials,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(bottom = 16.dp),
            )
        }

        AppButton(
            text = strings.authSignInSubmit,
            onClick = { viewModel.signIn(onSignInSuccess) },
            isLoading = state.loginState is UiState.Loading,
        )

        AppGhostButton(
            text = strings.authSignInForgotPassword,
            onClick = onNavigateToForgotPassword,
        )

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                strings.authSignInSignUpPrompt,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            AppGhostButton(
                text = strings.authSignInSignUpAction,
                onClick = onNavigateToSignUp,
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Surface(
            color = MaterialTheme.colorScheme.surface,
            shape = RoundedCornerShape(12.dp),
        ) {
            Text(
                strings.authSignInDemo,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(12.dp),
                textAlign = TextAlign.Center,
            )
        }

        LanguageSwitcher()
    }
}
