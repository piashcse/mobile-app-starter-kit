package features.faq.viewmodel

import core.api.ApiClient
import core.api.FaqItem
import core.viewmodel.BaseViewModel
import core.viewmodel.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class FaqState(
    val items: UiState<List<FaqItem>> = UiState.Loading,
    val expandedId: Int? = null,
)

class FaqViewModel(private val apiClient: ApiClient) : BaseViewModel() {
    private val _state = MutableStateFlow(FaqState())
    val state: StateFlow<FaqState> = _state.asStateFlow()

    init { loadFaq() }

    private fun loadFaq() {
        viewModelScope.launch {
            apiClient.getFaqItems()
                .onSuccess { _state.value = _state.value.copy(items = UiState.Success(it)) }
                .onFailure { _state.value = _state.value.copy(items = UiState.Error(it.message ?: "Failed")) }
        }
    }

    fun toggleExpand(id: Int) {
        _state.value = _state.value.copy(
            expandedId = if (_state.value.expandedId == id) null else id
        )
    }
}
