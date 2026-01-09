'use client';

import { cn } from '@repo/shared/utils';

import { SignUpForm } from '@/widgets/signup';

const SignUpPage = () => {
  return (
    <div
      className={cn(
        'bg-background flex h-[calc(100vh-4.0625rem)] items-center justify-center px-4',
      )}
    >
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
