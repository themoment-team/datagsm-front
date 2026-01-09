'use client';

import { SignInForm } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

const SignInPage = () => {
  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
