package features.forgotpassword.viewmodel

import core.api.ApiClient
import core.viewmodel.BaseViewModel
import core.viewmodel.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ForgotPasswordViewModel(private val apiClient: ApiClient) : BaseViewModel() {
    private val _email = MutableStateFlow("")
    val email: StateFlow<String> = _email.asStateFlow()

    private val _state = MutableStateFlow<UiState<String>>(UiState.Idle)
    val state: StateFlow<UiState<String>> = _state.asStateFlow()

    fun updateEmail(email: String) { _email.value = email }

    fun submit(onSuccess: () -> Unit) {
        viewModelScope.launch {
            _state.value = UiState.Loading
            apiClient.forgotPassword(_email.value)
                .onSuccess { msg -> _state.value = UiState.Success(msg); onSuccess() }
                .onFailure { e -> _state.value = UiState.Error(e.message ?: "Failed") }
        }
    }
}
