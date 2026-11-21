package features.signin.viewmodel

import core.api.ApiClient
import core.api.LoginResponse
import core.error.AppError
import core.error.toAppError
import core.observability.AnalyticsProvider
import core.validation.validateEmail
import core.validation.validatePassword
import core.viewmodel.BaseViewModel
import core.viewmodel.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class SignInState(
    val email: String = "",
    val password: String = "",
    val loginState: UiState<LoginResponse> = UiState.Idle,
)

class SignInViewModel(private val apiClient: ApiClient) : BaseViewModel() {
    private val _state = MutableStateFlow(SignInState())
    val state: StateFlow<SignInState> = _state.asStateFlow()

    fun updateEmail(email: String) {
        _state.value = _state.value.copy(email = email)
    }

    fun updatePassword(password: String) {
        _state.value = _state.value.copy(password = password)
    }

    fun signIn(onSuccess: () -> Unit) {
        val current = _state.value
        val validation = validateEmail(current.email)
            ?: validatePassword(current.password)

        if (validation != null) {
            _state.value = current.copy(
                loginState = UiState.Error(AppError.Validation(validation)),
            )
            return
        }

        viewModelScope.launch {
            _state.value = current.copy(loginState = UiState.Loading)
            apiClient.login(current.email.trim(), current.password)
                .onSuccess { response ->
                    _state.value = _state.value.copy(
                        loginState = UiState.Success(response),
                    )
                    AnalyticsProvider.analytics.track("sign_in")
                    onSuccess()
                }
                .onFailure { error ->
                    _state.value = _state.value.copy(
                        loginState = UiState.Error(error.toAppError()),
                    )
                }
        }
    }
}
