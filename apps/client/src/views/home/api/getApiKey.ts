import { cookies } from 'next/headers';

import { authUrl } from '@repo/shared/api';

import { ApiKeyResponse } from '@/entities/home';

export const getApiKey = async (): Promise<ApiKeyResponse | undefined> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

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

    console.log(apiKeyData);

    return apiKeyData;
  } catch {
    return undefined;
  }
};
