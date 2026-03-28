package core.api

import kotlinx.serialization.Serializable

@Serializable
data class LoginResponse(
    val token: String,
    val user: UserInfo
)

@Serializable
data class UserInfo(
    val id: Int,
    val name: String,
    val email: String,
    val avatar: String? = null
)

@Serializable
data class UserProfile(
    val id: Int,
    val name: String,
    val email: String,
    val avatar: String? = null,
    val phone: String? = null,
    val bio: String? = null,
    val location: String? = null,
    val joinedDate: String? = null
)

@Serializable
data class FaqItem(
    val id: Int,
    val question: String,
    val answer: String
)

@Serializable
data class NotificationItem(
    val id: Int,
    val title: String,
    val body: String,
    val read: Boolean,
    val createdAt: String,
    val type: String
)
