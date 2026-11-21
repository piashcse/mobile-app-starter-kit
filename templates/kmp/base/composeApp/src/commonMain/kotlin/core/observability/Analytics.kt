package core.observability

interface Analytics {
    fun track(event: String)
}

object NoopAnalytics : Analytics {
    override fun track(event: String) = Unit
}

object AnalyticsProvider {
    var analytics: Analytics = NoopAnalytics
}
