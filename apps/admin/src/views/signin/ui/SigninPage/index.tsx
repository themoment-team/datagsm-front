'use client';

import { SigninForm } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

import { useGoogleLogin } from '@/features/auth';

const SigninPage = () => {
  const handleGoogleLogin = useGoogleLogin();

  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <SigninForm title="Data GSM Admin" onGoogleLogin={handleGoogleLogin} />
    </div>
  );
};

export default SigninPage;
