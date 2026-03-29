const TOKEN_COOKIE = 'token';

export function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${TOKEN_COOKIE}=([^;]+)`));
  return match ? match[2] : null;
}

export function setToken(token: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=86400; SameSite=Strict`;
}

export function clearToken(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
}
