import { Suspense } from 'react';

import { Skeleton } from '@repo/shared/ui';

import { SignInPage } from '@/views/signin';

const SignIn = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
          <div className="max-w-180 flex w-full flex-col items-center gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      }
    >
      <SignInPage />
    </Suspense>
  );
};

export default SignIn;
