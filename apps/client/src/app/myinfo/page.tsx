import { cookies } from 'next/headers';

import { accountQueryKeys, accountUrl, get } from '@repo/shared/api';
import { COOKIE_KEYS } from '@repo/shared/constants';
import { MyAccountResponse } from '@repo/shared/types';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

import MyInfoPage from '@/views/mypage/ui/MyInfoPage';

const MyInfo = async () => {
  const queryClient = new QueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  if (token) {
    await queryClient.prefetchQuery({
      queryKey: accountQueryKeys.getMy(),
      queryFn: () =>
        get<MyAccountResponse>(accountUrl.getMy(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyInfoPage />
    </HydrationBoundary>
  );
};

export default MyInfo;
