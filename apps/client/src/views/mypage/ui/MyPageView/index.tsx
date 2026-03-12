'use client';

import { Skeleton } from '@repo/shared/ui';

import { ProfileInfo, WithdrawalSection, useGetMy } from '@/widgets/mypage';

export const MyPageView = () => {
  const { data: myData, isLoading, isError } = useGetMy();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !myData?.data) {
    return (
      <div className="bg-muted/20 mx-auto max-w-2xl rounded-lg border px-4 py-12 text-center">
        <h2 className="text-xl font-bold">정보를 불러올 수 없습니다.</h2>
        <p className="text-muted-foreground mt-2">
          로그인 상태를 확인하거나 잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 pb-24">
      <div className="space-y-10">
        <ProfileInfo data={myData.data} />
        <WithdrawalSection />
      </div>
    </div>
  );
};
