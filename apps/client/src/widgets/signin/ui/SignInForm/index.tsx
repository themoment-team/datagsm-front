'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { SignInFormType } from '@repo/shared/types';
import { SignInForm as SharedSignInForm } from '@repo/shared/ui';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { useRequestOAuthCode } from '../../model/useRequestOAuthCode';

interface SignInFormProps {
  clientId: string | null;
  redirectUri: string | null;
}

const SignInForm = ({ clientId, redirectUri }: SignInFormProps) => {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isInternalLoginPending, setIsInternalLoginPending] = useState(false);

  const isExternalOAuth = clientId !== null && redirectUri !== null;

  const internalClientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID!;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 외부 OAuth 코드 발급 (외부 서비스로 리다이렉트용)
  const { mutate: requestExternalOAuthCode, isPending: isRequestingExternalCode } =
    useRequestOAuthCode({
      onSuccess: (response) => {
        if (redirectUri && response.data.code) {
          const redirectUrl = `${redirectUri}?code=${response.data.code}`;
          window.location.href = redirectUrl;
        }
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError && error.response?.data) {
          const errorData = error.response.data;

          if (errorData.error && errorData.error_description) {
            toast.error(errorData.error_description);
            timerRef.current = setTimeout(() => {
              router.push('/');
            }, 1500);
            return;
          }

          const statusCode = (errorData as { code?: number })?.code;

          switch (statusCode) {
            case 400:
              toast.error('잘못된 요청입니다.');
              break;
            case 404:
              toast.error('존재하지 않는 클라이언트입니다.');
              break;
            default:
              toast.error('OAuth 인증에 실패했습니다.');
          }
        } else {
          toast.error('OAuth 인증에 실패했습니다.');
        }

        timerRef.current = setTimeout(() => {
          router.push('/signin');
        }, 1500);
      },
    });

  const handleInternalLogin = async (email: string, password: string) => {
    setIsInternalLoginPending(true);

    try {
      const oauthBaseUrl = process.env.NEXT_PUBLIC_OAUTH_BASE_URL || 'http://localhost:8081';

      // 1. 세션 생성 (GET /v1/oauth/authorize)
      const state = Math.random().toString(36).substring(2, 15);
      const authorizeUrl = `${oauthBaseUrl}/v1/oauth/authorize?${new URLSearchParams({
        client_id: internalClientId,
        redirect_uri: `${window.location.origin}/callback`,
        response_type: 'code',
        state,
      })}`;

      await fetch(authorizeUrl, {
        credentials: 'include',
        redirect: 'manual',
      });

      // 2. 로그인 (POST /api/oauth/authorize)
      const loginResponse = await fetch('/api/oauth/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
        }
      } else {
        const errorData = await loginResponse.json();
        if (errorData.error_description) {
          toast.error(errorData.error_description);
        } else {
          switch (loginResponse.status) {
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
              toast.error('로그인에 실패했습니다.');
          }
        }
      }
    } catch {
      toast.error('로그인에 실패했습니다.');
    } finally {
      setIsInternalLoginPending(false);
    }
  };

  const handleSubmit = async (data: SignInFormType) => {
    if (isExternalOAuth) {
      // 외부 OAuth: PKCE 없이 (외부 서비스가 client_secret으로 토큰 교환)
      requestExternalOAuthCode({
        email: data.email,
        password: data.password,
        clientId: clientId!,
        redirectUrl: redirectUri!,
      });
    } else {
      await handleInternalLogin(data.email, data.password);
    }
  };

  return (
    <SharedSignInForm
      onSubmit={handleSubmit}
      isPending={isExternalOAuth ? isRequestingExternalCode : isInternalLoginPending}
      signupHref="/signup"
    />
  );
};

export default SignInForm;
