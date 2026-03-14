'use client';

import { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { SignInFormType } from '@repo/shared/types';
import { SignInForm } from '@repo/shared/ui';
import { cn, minutesToMs } from '@repo/shared/utils';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const SESSION_TIMEOUT_MS = minutesToMs(10);
const WARNING_TIMES = {
  ONE_MIN: 60,
  THIRTY_SEC: 30,
} as const;
const STORAGE_KEY = 'oauth_session_timestamp';

const OAuthAuthorizeForm = () => {
  const [serviceName, setServiceName] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [isLoadingServiceName, setIsLoadingServiceName] = useState(true);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const sessionStartTime = useRef<number | null>(null);
  const hasShownWarnings = useRef({ oneMin: false, thirtySec: false, expired: false });

  const updateRemainingTime = () => {
    if (!sessionStartTime.current) return false;

    const now = Date.now();
    const elapsed = now - sessionStartTime.current;
    const remaining = Math.max(0, Math.ceil((SESSION_TIMEOUT_MS - elapsed) / 1000));

    setRemainingTime(remaining);

    if (remaining <= 0) {
      setIsExpired(true);
      if (!hasShownWarnings.current.expired) {
        hasShownWarnings.current.expired = true;
        toast.error('인증 세션이 만료되었습니다. 처음부터 다시 시도해주세요.');
      }
      return true;
    }

    if (remaining <= WARNING_TIMES.ONE_MIN && !hasShownWarnings.current.oneMin) {
      hasShownWarnings.current.oneMin = true;
      toast.info('1분 후 세션이 만료됩니다.');
    }
    if (remaining <= WARNING_TIMES.THIRTY_SEC && !hasShownWarnings.current.thirtySec) {
      hasShownWarnings.current.thirtySec = true;
      toast.info('30초 후 세션이 만료됩니다.');
    }
    return false;
  };

  useEffect(() => {
    if (!token) return;

    const now = Date.now();
    const storedData = localStorage.getItem(STORAGE_KEY);
    let startTime = now;

    try {
      const parsed = storedData ? JSON.parse(storedData) : null;
      if (parsed?.token === token && typeof parsed?.startTime === 'number') {
        startTime = parsed.startTime;
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, startTime: now }));
      }
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, startTime: now }));
    }

    sessionStartTime.current = startTime;
    updateRemainingTime();
  }, [token]);

  useEffect(() => {
    if (isExpired) return;

    const timer = setInterval(() => {
      const expired = updateRemainingTime();
      if (expired) clearInterval(timer);
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateRemainingTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isExpired]);

  useEffect(() => {
    if (!token) {
      setIsLoadingServiceName(false);
      return;
    }

    fetch(`/api/oauth/sessions/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.service_name) {
          setServiceName(data.data.service_name);
        }
      })
      .catch((error) => {
        console.error('서비스 이름 조회 실패:', error);
      })
      .finally(() => {
        setIsLoadingServiceName(false);
      });
  }, [token]);

  const handleSubmit = async (data: SignInFormType) => {
    if (isExpired) {
      toast.error('세션이 만료되었습니다. 다시 시도해주세요.');
      return;
    }

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
        localStorage.removeItem(STORAGE_KEY);

        if (responseData.redirect_url) {
          window.location.href = responseData.redirect_url;
          return;
        }
      }

      if (!response.ok) {
        switch (response.status) {
          case 400:
            toast.error('세션이 만료되었습니다. 다시 시도해주세요.');
            setIsExpired(true);
            break;
          case 401:
            toast.error('이메일 또는 비밀번호가 일치하지 않습니다.');
            break;
          default:
            toast.error('로그인에 실패했습니다.');
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
    <div className="max-w-180 relative flex w-full flex-col items-center gap-6">
      <SignInForm
        onSubmit={handleSubmit}
        isPending={isPending}
        signupHref="/signup"
        serviceName={serviceName || undefined}
        isLoadingServiceName={isLoadingServiceName}
        remainingTime={remainingTime}
      />

      {isExpired && (
        <div
          className={cn(
            'bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm',
          )}
        >
          <div className="bg-card flex max-w-md flex-col items-center gap-4 rounded-lg border p-8 text-center shadow-lg">
            <div className="bg-destructive/10 rounded-full p-3">
              <AlertCircle className="text-destructive h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">인증 세션 만료</h2>
            <p className="text-muted-foreground">
              보안을 위해 인증 세션이 만료되었습니다.
              <br />이 창을 닫고 서비스에서 다시 로그인을 시도해주세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OAuthAuthorizeForm;
