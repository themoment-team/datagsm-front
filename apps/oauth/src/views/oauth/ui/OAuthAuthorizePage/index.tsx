'use client';

import { cn } from '@repo/shared/utils';

import { OAuthAuthorizeForm } from '@/widgets/oauth';

const OAuthAuthorizePage = () => {
  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <OAuthAuthorizeForm />
    </div>
  );
};

export default OAuthAuthorizePage;
