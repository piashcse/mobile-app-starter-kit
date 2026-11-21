package core.i18n

import platform.Foundation.NSUserDefaults

actual class LocaleStore actual constructor() {
    private val defaults = NSUserDefaults.standardUserDefaults

    actual fun load(): String? = defaults.stringForKey("mask.locale")

    actual fun save(code: String) {
        defaults.setObject(code, forKey = "mask.locale")
    }

    actual fun systemLanguage(): String {
        val identifier = defaults.stringForKey("AppleLocale") ?: "en"
        return identifier.substringBefore("_").substringBefore("-").ifEmpty { "en" }
    }
}
