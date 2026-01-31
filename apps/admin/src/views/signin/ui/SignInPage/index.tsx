'use client';

import { cn } from '@repo/shared/utils';

import { SignInForm } from '@/widgets/signin';

const SignInPage = () => {
  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
