/** 头像类型：文字或图片 */
export type AvatarType = 'text' | 'image';

/** 用户头像 */
export interface UserAvatar {
  type: AvatarType;
  /** 文字头像为展示字符；图片头像为 data URL */
  value: string;
}

/** 登录用户 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  rememberMe: boolean;
  avatar: UserAvatar;
}

/** 个人资料编辑表单 */
export interface ProfileFormValues {
  displayName: string;
  avatarType: AvatarType;
  avatarValue: string;
}

/** 个人资料编辑页 Props 相关 */
export interface ProfileUpdatePayload {
  displayName: string;
  avatar: UserAvatar;
}
