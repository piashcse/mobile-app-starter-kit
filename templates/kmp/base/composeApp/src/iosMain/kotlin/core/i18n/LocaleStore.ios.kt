package core.i18n

import platform.Foundation.NSUserDefaults

private val defaults: NSUserDefaults
    get() = NSUserDefaults.standardUserDefaults

actual fun loadStoredLocale(): String? = defaults.stringForKey("mask.locale")

actual fun saveStoredLocale(code: String) {
    defaults.setObject(code, forKey = "mask.locale")
}

actual fun systemLanguage(): String {
    val identifier = defaults.stringForKey("AppleLocale") ?: "en"
    return identifier.substringBefore("_").substringBefore("-").ifEmpty { "en" }
}
