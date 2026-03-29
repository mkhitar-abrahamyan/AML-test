import { request } from './apiClient';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { email: string; password: string; name: string; }

export async function login(payload: LoginPayload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export async function register(payload: RegisterPayload) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}
