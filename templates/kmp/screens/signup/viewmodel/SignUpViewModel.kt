package features.signup.viewmodel

import core.api.ApiClient
import core.error.AppError
import core.error.toAppError
import core.validation.validateEmail
import core.validation.validateName
import core.validation.validatePassword
import core.validation.validatePasswordConfirmation
import core.viewmodel.BaseViewModel
import core.viewmodel.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class SignUpState(
    val name: String = "",
    val email: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val registerState: UiState<Unit> = UiState.Idle,
)

class SignUpViewModel(private val apiClient: ApiClient) : BaseViewModel() {
    private val _state = MutableStateFlow(SignUpState())
    val state: StateFlow<SignUpState> = _state.asStateFlow()

    fun updateName(name: String) {
        _state.value = _state.value.copy(name = name)
    }

    fun updateEmail(email: String) {
        _state.value = _state.value.copy(email = email)
    }

    fun updatePassword(password: String) {
        _state.value = _state.value.copy(password = password)
    }

    fun updateConfirmPassword(password: String) {
        _state.value = _state.value.copy(confirmPassword = password)
    }

    fun signUp(onSuccess: () -> Unit) {
        val current = _state.value
        val validation = validateName(current.name)
            ?: validateEmail(current.email)
            ?: validatePassword(current.password)
            ?: validatePasswordConfirmation(
                current.password,
                current.confirmPassword,
            )

        if (validation != null) {
            _state.value = current.copy(
                registerState = UiState.Error(AppError.Validation(validation))
            )
            return
        }

        viewModelScope.launch {
            _state.value = current.copy(registerState = UiState.Loading)
            apiClient.register(
                name = current.name.trim(),
                email = current.email.trim(),
                password = current.password,
            ).onSuccess {
                _state.value = _state.value.copy(registerState = UiState.Success(Unit))
                onSuccess()
            }.onFailure { error ->
                _state.value = _state.value.copy(
                    registerState = UiState.Error(error.toAppError())
                )
            }
        }
    }
}
