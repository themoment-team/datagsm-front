'use client';

import { SigninForm } from '@repo/shared/ui';

const SigninPage = () => {
  return (
    <SigninForm
      title="Data GSM"
      subtitle="@gsm.hs.kr 도메인 계정만 사용 가능합니다"
      onGoogleLogin={() => {
        console.log('client: google login click');
      }}
    />
  );
};

export default SigninPage;
