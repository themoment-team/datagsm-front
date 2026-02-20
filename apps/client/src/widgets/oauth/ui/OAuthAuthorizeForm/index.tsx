'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { SignInFormType } from '@repo/shared/types';
import { SignInForm as SharedSignInForm } from '@repo/shared/ui';
import { toast } from 'sonner';

const OAuthAuthorizeForm = () => {
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (data: SignInFormType) => {
    setIsPending(true);

    if (!token) {
      toast.error('인증 토큰이 없습니다. 다시 시도해주세요.');
      setIsPending(false);
      return;
    }

    try {
      const response = await fetch('/api/oauth/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          token: token,
        }),
        credentials: 'same-origin',
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.redirect_url) {
          window.location.href = responseData.redirect_url;
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.error_description) {
          toast.error(errorData.error_description);
        } else {
          switch (response.status) {
            case 400:
              toast.error('세션이 만료되었습니다. 다시 시도해주세요.');
              break;
            case 401:
              toast.error('이메일 또는 비밀번호가 일치하지 않습니다.');
              break;
            default:
              toast.error('로그인에 실패했습니다.');
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '네트워크 오류가 발생했습니다.');
      } else {
        toast.error('알 수 없는 네트워크 오류가 발생했습니다.');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-180 flex w-full flex-col items-center gap-6">
      <SharedSignInForm onSubmit={handleSubmit} isPending={isPending} signupHref="/signup" />
    </div>
  );
};

export default OAuthAuthorizeForm;
