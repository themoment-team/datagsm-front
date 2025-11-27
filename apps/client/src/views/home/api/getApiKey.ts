import { cookies } from 'next/headers';

import { authUrl } from '@repo/shared/api';

import { ApiKeyResponse } from '@/entities/home';

export const getApiKey = async (): Promise<ApiKeyResponse | undefined> => {
  try {
    const accessToken = (await cookies()).get('accessToken')?.value;

    const response = await fetch(
      new URL(authUrl.getApiKey(), process.env.NEXT_PUBLIC_API_BASE_URL),
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      },
    );

    if (!response.ok) {
      console.error('Failed to fetch API key:', response.status, response.statusText);
      return undefined;
    }

    const apiKeyData = await response.json();

    return apiKeyData;
  } catch (error) {
    console.error('Error in getApiKey:', error);
    return undefined;
  }
};
