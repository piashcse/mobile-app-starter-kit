package features.changepassword.view

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
import core.components.AppButton
import core.components.AppInput
import core.error.localized
import core.theme.AppSizes
import core.theme.AppSpacing
import core.viewmodel.UiState
import di.ViewModelProvider

@Composable
fun ChangePasswordScreen(onSuccess: () -> Unit = {}) {
    val viewModel = remember { ViewModelProvider.changePasswordViewModel() }
    DisposableEffect(viewModel) { onDispose { viewModel.onCleared() } }
    val state by viewModel.state.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(AppSizes.screenPadding),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("🔑", style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(AppSpacing.md))
        Text(
            stringResource(Res.string.auth_change_password_title),
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(AppSpacing.xl))

        AppInput(
            value = state.currentPassword,
            onValueChange = viewModel::updateCurrentPassword,
            label = stringResource(Res.string.auth_change_password_current_label),
            isPassword = true,
        )
        AppInput(
            value = state.newPassword,
            onValueChange = viewModel::updateNewPassword,
            label = stringResource(Res.string.auth_change_password_new_label),
            isPassword = true,
        )
        AppInput(
            value = state.confirmPassword,
            onValueChange = viewModel::updateConfirmPassword,
            label = stringResource(Res.string.auth_change_password_confirm_label),
            isPassword = true,
        )

        (state.submitState as? UiState.Error)?.let { errorState ->
            Text(
                errorState.error.localized(),
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(bottom = AppSpacing.md),
            )
        }

        AppButton(
            text = stringResource(Res.string.auth_change_password_submit),
            onClick = { viewModel.submit(onSuccess) },
            isLoading = state.submitState is UiState.Loading,
        )
    }
}
