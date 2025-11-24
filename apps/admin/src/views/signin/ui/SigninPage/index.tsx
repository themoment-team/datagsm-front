'use client';

import { SigninForm } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

const SigninPage = () => {
  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <SigninForm
        title="Data GSM Admin"
        onGoogleLogin={() => {
          console.log('admin: google login click');
        }}
      />
    </div>
  );
};

export default SigninPage;
