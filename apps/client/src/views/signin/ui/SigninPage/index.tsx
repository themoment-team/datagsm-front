'use client';

import { cn } from '@repo/shared/lib';
import { SigninForm } from '@repo/shared/ui';

import { useGoogleLogin } from '@/features/auth';

const SigninPage = () => {
  const handleGoogleLogin = useGoogleLogin();

  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <SigninForm
        title="Data GSM"
        subtitle="@gsm.hs.kr 계정만 사용 가능합니다"
        onGoogleLogin={handleGoogleLogin}
      />
    </div>
  );
};

export default SigninPage;
