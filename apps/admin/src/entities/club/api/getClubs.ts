import { cookies } from 'next/headers';

import { clubUrl } from '@repo/shared/api';
import { COOKIE_KEYS } from '@repo/shared/constants';
import { ClubListResponse } from '@repo/shared/types';

export const getClubs = async (): Promise<ClubListResponse | undefined> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    const url = new URL(clubUrl.getClubs(), process.env.NEXT_PUBLIC_API_BASE_URL);

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

    const clubsData = await response.json();

    return clubsData;
  } catch {
    return undefined;
  }
};
