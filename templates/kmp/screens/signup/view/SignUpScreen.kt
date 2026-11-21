package features.signup.view

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.text.input.KeyboardType
import core.components.AppButton
import core.components.AppGhostButton
import core.components.AppInput
import core.error.localized
import core.theme.AppSizes
import core.theme.AppSpacing
import core.viewmodel.UiState
import di.ViewModelProvider
import features.signup.viewmodel.SignUpViewModel

@Composable
fun SignUpScreen(
    onSuccess: () -> Unit = {},
    onNavigateToSignIn: () -> Unit = {},
) {
    val viewModel = remember { ViewModelProvider.signUpViewModel() }
    DisposableEffect(viewModel) { onDispose { viewModel.onCleared() } }
    val state by viewModel.state.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(AppSizes.screenPadding),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("🚀", style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(AppSpacing.md))
        Text(
            stringResource(Res.string.auth_sign_up_title),
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(AppSpacing.xl))

        AppInput(
            value = state.name,
            onValueChange = viewModel::updateName,
            label = stringResource(Res.string.auth_sign_up_name_label),
            placeholder = stringResource(Res.string.auth_sign_up_name_placeholder),
        )
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
            placeholder = stringResource(Res.string.auth_sign_up_password_placeholder),
            isPassword = true,
        )
        AppInput(
            value = state.confirmPassword,
            onValueChange = viewModel::updateConfirmPassword,
            label = stringResource(Res.string.auth_sign_up_confirm_password_label),
            placeholder = stringResource(Res.string.auth_sign_up_confirm_password_placeholder),
            isPassword = true,
        )

        (state.registerState as? UiState.Error)?.let { errorState ->
            Text(
                errorState.error.localized(),
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(bottom = AppSpacing.md),
            )
        }

        AppButton(
            text = stringResource(Res.string.auth_sign_up_submit),
            onClick = { viewModel.signUp(onSuccess) },
            isLoading = state.registerState is UiState.Loading,
        )

        Spacer(Modifier.height(AppSpacing.md))
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(AppSpacing.xs),
        ) {
            Text(
                stringResource(Res.string.auth_sign_up_sign_in_prompt),
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            AppGhostButton(
                text = stringResource(Res.string.auth_sign_up_sign_in_action),
                onClick = onNavigateToSignIn,
            )
        }
    }
}
