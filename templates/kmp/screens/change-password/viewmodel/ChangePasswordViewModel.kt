package features.changepassword.viewmodel

import core.api.ApiClient
import core.error.AppError
import core.error.ValidationReason
import core.error.toAppError
import core.validation.validateField
import core.validation.validatePassword
import core.validation.validatePasswordConfirmation
import core.viewmodel.BaseViewModel
import core.viewmodel.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ChangePasswordState(
    val currentPassword: String = "",
    val newPassword: String = "",
    val confirmPassword: String = "",
    val submitState: UiState<Unit> = UiState.Idle,
)

class ChangePasswordViewModel(
    private val apiClient: ApiClient,
) : BaseViewModel() {
    private val _state = MutableStateFlow(ChangePasswordState())
    val state: StateFlow<ChangePasswordState> = _state.asStateFlow()

    fun updateCurrentPassword(value: String) {
        _state.value = _state.value.copy(currentPassword = value)
    }

    fun updateNewPassword(value: String) {
        _state.value = _state.value.copy(newPassword = value)
    }

    fun updateConfirmPassword(value: String) {
        _state.value = _state.value.copy(confirmPassword = value)
    }

    fun submit(onSuccess: () -> Unit) {
        val current = _state.value
        val validation = validateField(
            current.currentPassword,
            ValidationReason.CurrentPasswordRequired,
        ) ?: validatePassword(current.newPassword)
            ?: validatePasswordConfirmation(
                current.newPassword,
                current.confirmPassword,
            )

        if (validation != null) {
            _state.value = current.copy(
                submitState = UiState.Error(AppError.Validation(validation)),
            )
            return
        }

        viewModelScope.launch {
            _state.value = current.copy(submitState = UiState.Loading)
            apiClient.changePassword(
                current.currentPassword,
                current.newPassword,
            ).onSuccess {
                _state.value = _state.value.copy(
                    submitState = UiState.Success(Unit),
                )
                onSuccess()
            }.onFailure { error ->
                _state.value = _state.value.copy(
                    submitState = UiState.Error(error.toAppError()),
                )
            }
        }
    }
}
