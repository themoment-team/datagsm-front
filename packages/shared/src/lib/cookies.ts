export const setCookie = (name: string, value: string): void => {
  if (typeof document === 'undefined') return;

  const cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; samesite=Lax; secure`;

  document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }

  return null;
};

export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;

  const cookieString = `${encodeURIComponent(name)}=; path=/; samesite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure`;

  document.cookie = cookieString;
};

export const getAllCookies = (): Record<string, string> => {
  if (typeof document === 'undefined') return {};

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(';');

  for (const cookie of cookieArray) {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
};

export const clearAllCookies = (): void => {
  const cookies = getAllCookies();

  for (const name in cookies) {
    deleteCookie(name);
  }
};
