'use client';

import { SigninForm } from '@repo/shared/ui';

const SigninPage = () => {
  return (
    <SigninForm
      title="Data GSM Admin"
      onGoogleLogin={() => {
        console.log('admin: google login click');
      }}
    />
  );
};

export default SigninPage;
