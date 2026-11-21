package features.signin.view

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import app.generated.resources.*
import org.jetbrains.compose.resources.stringResource
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
import core.error.localized
import core.i18n.LanguageSwitcher
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
    val logoLabel = stringResource(Res.string.auth_sign_in_logo_label)

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
                contentDescription = logoLabel
            },
        )
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            stringResource(Res.string.auth_sign_in_title),
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(modifier = Modifier.height(8.dp))

        Text(
            stringResource(Res.string.auth_sign_in_subtitle),
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(modifier = Modifier.height(32.dp))

        AppInput(
            value = state.email,
            onValueChange = viewModel::updateEmail,
            label = stringResource(Res.string.auth_sign_in_email_label),
            placeholder = stringResource(Res.string.auth_sign_in_email_placeholder),
            keyboardType = KeyboardType.Email,
        )

        AppInput(
            value = state.password,
            onValueChange = viewModel::updatePassword,
            label = stringResource(Res.string.auth_sign_in_password_label),
            placeholder = stringResource(Res.string.auth_sign_in_password_placeholder),
            isPassword = true,
        )

        if (state.loginState is UiState.Error) {
            Text(
                (state.loginState as UiState.Error).error.localized(),
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(bottom = 16.dp),
            )
        }

        AppButton(
            text = stringResource(Res.string.auth_sign_in_submit),
            onClick = { viewModel.signIn(onSignInSuccess) },
            isLoading = state.loginState is UiState.Loading,
        )

        AppGhostButton(
            text = stringResource(Res.string.auth_sign_in_forgot_password),
            onClick = onNavigateToForgotPassword,
        )

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                stringResource(Res.string.auth_sign_in_sign_up_prompt),
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            AppGhostButton(
                text = stringResource(Res.string.auth_sign_in_sign_up_action),
                onClick = onNavigateToSignUp,
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Surface(
            color = MaterialTheme.colorScheme.surface,
            shape = RoundedCornerShape(12.dp),
        ) {
            Text(
                stringResource(Res.string.auth_sign_in_demo),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(12.dp),
                textAlign = TextAlign.Center,
            )
        }

        LanguageSwitcher()
    }
}
