'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { COOKIE_KEYS } from '@repo/shared/constants';
import { deleteCookie, getCookie } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useGetRole } from '@/entities/signin';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const accessToken = getCookie(COOKIE_KEYS.ACCESS_TOKEN);
  const { data: role, isLoading, isError, refetch } = useGetRole();

  useEffect(() => {
    if (accessToken) {
      refetch();
    }
  }, [pathname, accessToken, refetch]);

  useEffect(() => {
    if (!accessToken) return;

    if (isLoading) return;

    if (isError) {
      toast.error('사용자 정보를 가져오는 데 실패했습니다. 다시 로그인해주세요.');
      queryClient.clear();
      deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
      deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);
      window.location.href = '/';
      return;
    }

    // 권한 확인 (ADMIN 또는 ROOT가 아닌 경우)
    if (role && role !== 'ADMIN' && role !== 'ROOT') {
      toast.error('접근 권한이 없습니다. 관리자 계정으로 로그인해주세요.');

      queryClient.clear();
      deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
      deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);

      window.location.href = '/';
    }
  }, [role, isLoading, isError, accessToken, queryClient]);

  return <>{children}</>;
};

export default AuthGuard;
