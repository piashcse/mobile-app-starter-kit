// === Auth Types ===
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}

// === User Types ===
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
}

// === FAQ Types ===
export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

// === Notification Types ===
export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// === Change Password Types ===
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// === App Types ===
export interface AppInfo {
  version: string;
  buildNumber: string;
  website: string;
  supportEmail: string;
  description: string;
}
