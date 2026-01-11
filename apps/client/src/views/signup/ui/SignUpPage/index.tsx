'use client';

import { cn } from '@repo/shared/utils';

import { SignUpForm } from '@/widgets/signup';

const SignUpPage = () => {
  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
