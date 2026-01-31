'use client';

import { useRouter } from 'next/navigation';

import { COOKIE_KEYS } from '@repo/shared/constants';
import { useSignIn } from '@repo/shared/hooks';
import { SignInFormType } from '@repo/shared/types';
import { SignInForm as SharedSignInForm } from '@repo/shared/ui';
import { setCookie } from '@repo/shared/utils';
import { toast } from 'sonner';

const SignInForm = () => {
  const router = useRouter();

  const { mutate: signIn, isPending: isSigningIn } = useSignIn({
    onSuccess: (response) => {
      if (response.data.accessToken && response.data.refreshToken) {
        setCookie(COOKIE_KEYS.ACCESS_TOKEN, response.data.accessToken);
        setCookie(COOKIE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      }

      toast.success('로그인에 성공했습니다.');
      router.push('/students');
    },
    onError: () => {
      toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    },
  });

  const handleSubmit = (data: SignInFormType) => {
    signIn(data);
  };

  return <SharedSignInForm onSubmit={handleSubmit} isPending={isSigningIn} />;
};

export default SignInForm;
