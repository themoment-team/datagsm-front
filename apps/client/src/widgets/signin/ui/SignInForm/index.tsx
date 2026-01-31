'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { COOKIE_KEYS } from '@repo/shared/constants';
import { useSignIn } from '@repo/shared/hooks';
import { SignInFormType } from '@repo/shared/types';
import { SignInForm as SharedSignInForm } from '@repo/shared/ui';
import { setCookie } from '@repo/shared/utils';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { useRequestOAuthCode } from '../../model/useRequestOAuthCode';

interface SignInFormProps {
  clientId: string | null;
  redirectUri: string | null;
}

const SignInForm = ({ clientId, redirectUri }: SignInFormProps) => {
  const router = useRouter();
  const formDataRef = useRef<SignInFormType | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isOAuthMode = clientId !== null && redirectUri !== null;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const { mutate: requestOAuthCode, isPending: isRequestingOAuthCode } = useRequestOAuthCode({
    onSuccess: (response) => {
      if (redirectUri && response.data.code) {
        const redirectUrl = `${redirectUri}?code=${response.data.code}`;
        window.location.href = redirectUrl;
      }
    },
    onError: (error: unknown) => {
      const statusCode =
        error instanceof AxiosError ? (error.response?.data as { code?: number })?.code : undefined;

      switch (statusCode) {
        case 400:
          toast.error('잘못된 요청입니다. 홈으로 이동합니다.');
          break;
        case 404:
          toast.error('존재하지 않는 클라이언트입니다. 홈으로 이동합니다.');
          break;
        default:
          toast.error('OAuth 인증에 실패했습니다. 홈으로 이동합니다.');
      }

      // OAuth 실패 시 홈으로 이동 (로그인은 이미 성공한 상태)
      timerRef.current = setTimeout(() => {
        router.push('/');
      }, 1500);
    },
  });

  const { mutate: signIn, isPending: isSigningIn } = useSignIn({
    onSuccess: (response) => {
      if (response.data.accessToken && response.data.refreshToken) {
        setCookie(COOKIE_KEYS.ACCESS_TOKEN, response.data.accessToken);
        setCookie(COOKIE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      }

      // OAuth 모드라면 자동으로 코드 발급
      if (isOAuthMode && formDataRef.current) {
        toast.success('로그인에 성공했습니다. 리디렉션 중...');
        // 로그인 성공 후 OAuth 코드 발급
        timerRef.current = setTimeout(() => {
          requestOAuthCode({
            email: formDataRef.current!.email,
            password: formDataRef.current!.password,
            clientId: clientId!,
            redirectUrl: redirectUri!,
          });
        }, 500);
      } else {
        toast.success('로그인에 성공했습니다.');
        router.push('/');
      }
    },
    onError: (error: unknown) => {
      const statusCode =
        error instanceof AxiosError ? (error.response?.data as { code?: number })?.code : undefined;

      switch (statusCode) {
        case 400:
          toast.error('입력 정보를 확인해주세요.');
          break;
        case 401:
          toast.error('비밀번호가 일치하지 않습니다.');
          break;
        case 404:
          toast.error('존재하지 않는 계정입니다.');
          break;
        default:
          toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    },
  });

  const handleSubmit = (data: SignInFormType) => {
    // OAuth 모드를 위해 폼 데이터 저장
    formDataRef.current = data;
    signIn(data);
  };

  return (
    <SharedSignInForm
      onSubmit={handleSubmit}
      isPending={isSigningIn || isRequestingOAuthCode}
      signupHref="/signup"
    />
  );
};

export default SignInForm;
