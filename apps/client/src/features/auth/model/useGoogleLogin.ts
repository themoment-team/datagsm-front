import { useRouter } from 'next/navigation';

import { useGoogleLogin as useGoogleLoginBase } from '@react-oauth/google';
import { authUrl, post } from '@repo/shared/api';
import { COOKIE_KEYS } from '@repo/shared/constants';
import { LoginResponse } from '@repo/shared/types';
import { setCookie } from '@repo/shared/utils';
import { toast } from 'sonner';

export const useGoogleLogin = () => {
  const router = useRouter();

  const login = useGoogleLoginBase({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const response = await post<LoginResponse>(authUrl.postGoogleLogin(), {
          code: codeResponse.code,
        });

        if (response) {
          const { accessToken, refreshToken } = response.data;

          setCookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken);
          setCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken);

          toast.success('로그인에 성공했습니다.');

          router.push('/');
        } else {
          toast.error('로그인에 실패했습니다.');
        }
      } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        toast.error('로그인 중 오류가 발생했습니다.');
      }
    },
    onError: (errorResponse) => {
      console.error('Google 로그인 실패:', errorResponse);
      toast.error('Google 로그인에 실패했습니다.');
    },
  });

  return login;
};
