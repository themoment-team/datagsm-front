'use client';

import { useSearchParams } from 'next/navigation';

import { cn } from '@repo/shared/utils';

import { SignInForm } from '@/widgets/signin';

const SignInPage = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');

  if (clientId || redirectUri) {
    return (
      <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
        <div className="max-w-180 flex w-full flex-col items-center gap-6 rounded-lg border p-8">
          <h1 className="text-2xl font-bold text-destructive">잘못된 접근입니다</h1>
          <div className="flex flex-col gap-4 text-center">
            <p className="text-muted-foreground">
              외부 OAuth 인증은 표준 플로우를 사용해주세요.
            </p>
            <p className="text-muted-foreground text-sm">
              외부 서비스는 <code className="bg-muted rounded px-1">/v1/oauth/authorize</code>{' '}
              엔드포인트로 요청해야 합니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <SignInForm clientId={clientId} redirectUri={redirectUri} />
    </div>
  );
};

export default SignInPage;
