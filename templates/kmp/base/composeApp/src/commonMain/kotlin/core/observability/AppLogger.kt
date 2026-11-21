package core.observability

import core.config.AppConfig

object AppLogger {
    fun debug(message: String) {
        if (AppConfig.enableLogs) println("[debug] $message")
    }

    fun error(message: String, error: Throwable? = null) {
        if (AppConfig.enableLogs) println("[error] $message ${error?.message ?: ""}")
    }
}
