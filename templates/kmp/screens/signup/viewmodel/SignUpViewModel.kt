package features.signup.viewmodel

import core.api.ApiClient
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
    val registerState: UiState<String> = UiState.Idle,
)

class SignUpViewModel(private val apiClient: ApiClient) : BaseViewModel() {
    private val _state = MutableStateFlow(SignUpState())
    val state: StateFlow<SignUpState> = _state.asStateFlow()

    fun updateName(name: String) { _state.value = _state.value.copy(name = name) }
    fun updateEmail(email: String) { _state.value = _state.value.copy(email = email) }
    fun updatePassword(pw: String) { _state.value = _state.value.copy(password = pw) }
    fun updateConfirmPassword(pw: String) { _state.value = _state.value.copy(confirmPassword = pw) }

    fun signUp(onSuccess: () -> Unit) {
        viewModelScope.launch {
            _state.value = _state.value.copy(registerState = UiState.Loading)
            apiClient.register(_state.value.name, _state.value.email, _state.value.password)
                .onSuccess { msg ->
                    _state.value = _state.value.copy(registerState = UiState.Success(msg))
                    onSuccess()
                }
                .onFailure { e ->
                    _state.value = _state.value.copy(registerState = UiState.Error(e.message ?: "Failed"))
                }
        }
    }
}
