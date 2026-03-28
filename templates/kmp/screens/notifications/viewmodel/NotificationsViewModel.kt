package features.notifications.viewmodel

import core.api.ApiClient
import core.api.NotificationItem
import core.viewmodel.BaseViewModel
import core.viewmodel.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class NotificationsViewModel(private val apiClient: ApiClient) : BaseViewModel() {
    private val _state = MutableStateFlow<UiState<List<NotificationItem>>>(UiState.Loading)
    val state: StateFlow<UiState<List<NotificationItem>>> = _state.asStateFlow()

    init { load() }

    private fun load() {
        viewModelScope.launch {
            apiClient.getNotifications()
                .onSuccess { _state.value = UiState.Success(it) }
                .onFailure { _state.value = UiState.Error(it.message ?: "Failed") }
        }
    }
}
