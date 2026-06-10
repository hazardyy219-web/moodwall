export interface UserAvatar {
  type: 'text' | 'image';
  value: string;
}

export interface DbUser {
  id: string;
  email: string;
  username: string;
  avatar: string;
  password: string;
  created_at: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatar: UserAvatar;
}

export interface JwtPayload {
  userId: string;
  email: string;
}
