'use client';

import { cn } from '@repo/shared/utils';

import { SignInForm } from '@/widgets/signin';

const SignInPage = () => {
  return (
    <div
      className={cn(
        'bg-background flex h-[calc(100vh-4.0625rem)] items-center justify-center px-4',
      )}
    >
      <SignInForm />
    </div>
  );
};

export default SignInPage;
