class UserProfile {
  const UserProfile({
    required this.id,
    required this.name,
    required this.email,
    this.avatar,
    this.phone,
    this.bio,
    this.location,
    this.joinedDate,
  });

  final int id;
  final String name;
  final String email;
  final String? avatar;
  final String? phone;
  final String? bio;
  final String? location;
  final String? joinedDate;

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: (json['id'] as num?)?.toInt() ?? 0,
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      avatar: json['avatar'] as String?,
      phone: json['phone'] as String?,
      bio: json['bio'] as String?,
      location: json['location'] as String?,
      joinedDate: json['joinedDate'] as String?,
    );
  }
}
