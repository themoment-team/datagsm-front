import { cookies } from 'next/headers';

import { authUrl } from '@repo/shared/api';
import { COOKIE_KEYS } from '@repo/shared/constants';

import { ApiKeyResponse } from '@/entities/home';

export const getApiKey = async (): Promise<ApiKeyResponse | undefined> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    const url = new URL(authUrl.getApiKey(), process.env.NEXT_PUBLIC_API_BASE_URL);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return undefined;
    }

    const apiKeyData = await response.json();

    return apiKeyData;
  } catch {
    return undefined;
  }
};
