import { cookies } from 'next/headers';

import { accountUrl } from '@repo/shared/api';
import { COOKIE_KEYS } from '@repo/shared/constants';
import { MyAccountResponse } from '@repo/shared/types';

export const getMyAccountInfo = async (): Promise<MyAccountResponse | undefined> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  try {
    const response = await fetch(
      new URL(accountUrl.getMy(), process.env.NEXT_PUBLIC_API_BASE_URL).toString(),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const myInfo = await response.json();

    return myInfo;
  } catch {
    return undefined;
  }
};
