package core.config

/**
 * Runtime configuration. The mock switch can be changed by the host app (for
 * example from a developer settings screen) without rebuilding.
 */
object AppConfig {
    var apiBaseUrl: String = "https://api.example.com"
    var useMockApi: Boolean = true
    var enableLogs: Boolean = true
}
