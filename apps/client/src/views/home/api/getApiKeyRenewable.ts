import { cookies } from 'next/headers';

import { authUrl } from '@repo/shared/api';

import { ApiKeyRenewableResponse } from '@/entities/home';

export const getApiKeyRenewable = async (): Promise<ApiKeyRenewableResponse | undefined> => {
  try {
    const accessToken = (await cookies()).get('accessToken')?.value;

    const response = await fetch(
      new URL(authUrl.getApiKeyRenewable(), process.env.NEXT_PUBLIC_API_BASE_URL),
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
      console.error(
        'Failed to fetch API key renewable status:',
        response.status,
        response.statusText,
      );
      return undefined;
    }

    const apiKeyRenewableData = await response.json();

    return apiKeyRenewableData;
  } catch (error) {
    console.error('Error in getApiKeyRenewable:', error);
    return undefined;
  }
};
