import { cookies } from 'next/headers';

import { authUrl } from '@repo/shared/api';

import { ApiKeyRenewableResponse } from '@/entities/home';

export const getApiKeyRenewable = async (): Promise<ApiKeyRenewableResponse | undefined> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const url = new URL(authUrl.getApiKeyRenewable(), process.env.NEXT_PUBLIC_API_BASE_URL);

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

    const apiKeyRenewableData = await response.json();

    return apiKeyRenewableData;
  } catch {
    return undefined;
  }
};
