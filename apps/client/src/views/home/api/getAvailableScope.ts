import { cookies } from 'next/headers';

import { authUrl } from '@repo/shared/api';
import { COOKIE_KEYS } from '@repo/shared/constants';
import { UserRoleType } from '@repo/shared/types';

import { AvailableScopeListResponse } from '@/entities/home';

export const getAvailableScope = async (
  userRole: UserRoleType,
): Promise<AvailableScopeListResponse | undefined> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    const url = new URL(authUrl.getAvailableScope(userRole), process.env.NEXT_PUBLIC_API_BASE_URL);

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

    const AvailableScopeData = await response.json();

    return AvailableScopeData;
  } catch {
    return undefined;
  }
};
