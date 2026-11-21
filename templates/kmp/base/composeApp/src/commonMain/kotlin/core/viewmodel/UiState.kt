package core.viewmodel

import core.error.AppError

/**
 * Consistent UI state for every screen. Errors are typed and localized only at
 * the presentation layer.
 */
sealed class UiState<out T> {
    data object Idle : UiState<Nothing>()
    data object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val error: AppError) : UiState<Nothing>()
}
