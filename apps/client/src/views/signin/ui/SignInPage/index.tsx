'use client';

import { useSearchParams } from 'next/navigation';

import { cn } from '@repo/shared/utils';

import { SignInForm } from '@/widgets/signin';

const SignInPage = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');

  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <SignInForm clientId={clientId} redirectUri={redirectUri} />
    </div>
  );
};

export default SignInPage;
