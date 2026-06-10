import type { ProfileUpdatePayload } from '../types/auth';
import { api } from './client';
import type { ApiUser, AuthResponse } from './types';

export async function register(
  email: string,
  password: string,
  username?: string,
): Promise<AuthResponse> {
  return api<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(): Promise<{ user: ApiUser }> {
  return api<{ user: ApiUser }>('/auth/me');
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<{ user: ApiUser }> {
  return api<{ user: ApiUser }>('/users/profile', {
    method: 'PATCH',
    body: JSON.stringify({
      displayName: payload.displayName,
      avatar: payload.avatar,
    }),
  });
}

export async function getUserById(id: string): Promise<{ user: ApiUser }> {
  return api<{ user: ApiUser }>(`/users/${id}`);
}
