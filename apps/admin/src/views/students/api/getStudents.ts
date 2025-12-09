import { cookies } from 'next/headers';

import { studentUrl } from '@repo/shared/api';
import { COOKIE_KEYS } from '@repo/shared/constants';
import { StudentListResponse } from '@repo/shared/types';

const PAGE = 0;
const SIZE = 10;

export const getStudents = async (): Promise<StudentListResponse | undefined> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    const url = new URL(studentUrl.getStudents(PAGE, SIZE), process.env.NEXT_PUBLIC_API_BASE_URL);

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

    const studentsData = await response.json();

    return studentsData;
  } catch {
    return undefined;
  }
};
