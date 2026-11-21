package features.forgotpassword.viewmodel

import core.api.ApiClient
import core.error.AppError
import core.error.toAppError
import core.validation.validateEmail
import core.viewmodel.BaseViewModel
import core.viewmodel.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ForgotPasswordViewModel(private val apiClient: ApiClient) : BaseViewModel() {
    private val _email = MutableStateFlow("")
    val email: StateFlow<String> = _email.asStateFlow()

    private val _state = MutableStateFlow<UiState<Unit>>(UiState.Idle)
    val state: StateFlow<UiState<Unit>> = _state.asStateFlow()

    fun updateEmail(email: String) {
        _email.value = email
    }

    fun submit(onSuccess: () -> Unit) {
        val validation = validateEmail(_email.value)
        if (validation != null) {
            _state.value = UiState.Error(AppError.Validation(validation))
            return
        }

        viewModelScope.launch {
            _state.value = UiState.Loading
            apiClient.forgotPassword(_email.value.trim())
                .onSuccess {
                    _state.value = UiState.Success(Unit)
                    onSuccess()
                }
                .onFailure { error ->
                    _state.value = UiState.Error(error.toAppError())
                }
        }
    }
}
