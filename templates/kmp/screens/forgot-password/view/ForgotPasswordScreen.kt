package features.forgotpassword.view

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
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
import features.forgotpassword.viewmodel.ForgotPasswordViewModel

@Composable
fun ForgotPasswordScreen(onBack: () -> Unit = {}) {
    val viewModel = remember { ViewModelProvider.forgotPasswordViewModel() }
    DisposableEffect(viewModel) { onDispose { viewModel.onCleared() } }
    val email by viewModel.email.collectAsState()
    val state by viewModel.state.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(AppSizes.screenPadding),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("🔐", style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(AppSpacing.md))
        Text(
            stringResource(Res.string.auth_forgot_title),
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(AppSpacing.sm))
        Text(
            stringResource(Res.string.auth_forgot_subtitle),
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(AppSpacing.xl))

        AppInput(
            value = email,
            onValueChange = viewModel::updateEmail,
            label = stringResource(Res.string.auth_sign_in_email_label),
            placeholder = stringResource(Res.string.auth_sign_in_email_placeholder),
            keyboardType = KeyboardType.Email,
        )

        (state as? UiState.Error)?.let { errorState ->
            Text(
                errorState.error.localized(),
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(bottom = AppSpacing.md),
            )
        }

        AppButton(
            text = stringResource(Res.string.auth_forgot_submit),
            onClick = { viewModel.submit(onBack) },
            isLoading = state is UiState.Loading,
        )
        AppGhostButton(
            text = stringResource(Res.string.auth_forgot_back_to_sign_in),
            onClick = onBack,
        )
    }
}
