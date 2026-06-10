import type { UserAvatar } from '../types.js';

export function parseAvatar(raw: string): UserAvatar {
  try {
    const parsed = JSON.parse(raw) as UserAvatar;
    if (parsed?.type === 'image' && parsed.value) {
      return parsed;
    }
    if (parsed?.type === 'text' && parsed.value) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return { type: 'text', value: 'U' };
}

export function stringifyAvatar(avatar: UserAvatar): string {
  return JSON.stringify(avatar);
}

export function defaultAvatarFromName(name: string): UserAvatar {
  const letter = name.trim().charAt(0).toUpperCase() || 'U';
  return { type: 'text', value: letter };
}
