package core.i18n

import android.content.Context
import java.util.Locale

object AppContextHolder {
    var context: Context? = null
}

private fun prefs() = AppContextHolder.context?.getSharedPreferences("mask", Context.MODE_PRIVATE)

actual fun loadStoredLocale(): String? = prefs()?.getString("locale", null)

actual fun saveStoredLocale(code: String) {
    prefs()?.edit()?.putString("locale", code)?.apply()
}

actual fun systemLanguage(): String = Locale.getDefault().language.ifEmpty { "en" }
