'use client';

import { useEffect, useState } from 'react';

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
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const accessToken = getCookie(COOKIE_KEYS.ACCESS_TOKEN);
  const { data: role, isLoading, isError, refetch } = useGetRole();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (accessToken) {
      refetch();
    }
  }, [pathname, accessToken, refetch]);

  useEffect(() => {
    if (!accessToken || isLoading || isRedirecting) return;

    if (isError || (role && role !== 'ADMIN' && role !== 'ROOT')) {
      setIsRedirecting(true);

      const message = isError
        ? '인증 세션이 만료되었습니다. 다시 로그인해주세요.'
        : '접근 권한이 없습니다. 관리자 계정으로 로그인해주세요.';

      toast.error(message);
    }
  }, [role, isLoading, isError, accessToken, isRedirecting]);

  useEffect(() => {
    if (isRedirecting) {
      const timer = setTimeout(() => {
        queryClient.clear();
        deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
        deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);
        window.location.href = '/';
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isRedirecting, queryClient]);

  // 서버 사이드 렌더링 결과와 클라이언트의 첫 렌더링 결과를 일치킨다.
  if (!isMounted) {
    return <>{children}</>;
  }

  if (accessToken && (isLoading || isRedirecting)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
