'use client';

import { cn } from '@repo/shared/lib';
import { SigninForm } from '@repo/shared/ui';

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
