/** 根据邮箱生成稳定的用户 ID */
export function createUserIdFromEmail(email: string): string {
  return `user-${email.trim().toLowerCase()}`;
}

/** 从邮箱生成默认昵称 */
export function createDisplayNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? email;
  if (!localPart) {
    return 'User';
  }
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

/** 创建默认文字头像 */
export function createDefaultAvatar(displayName: string): { type: 'text'; value: string } {
  const letter = displayName.trim().charAt(0).toUpperCase() || 'U';
  return { type: 'text', value: letter };
}
