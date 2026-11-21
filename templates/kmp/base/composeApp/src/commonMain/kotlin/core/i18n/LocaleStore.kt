package core.i18n

expect fun loadStoredLocale(): String?

expect fun saveStoredLocale(code: String)

expect fun systemLanguage(): String
