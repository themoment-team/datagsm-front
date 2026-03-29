'use client';

import { useState } from 'react';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { SignInFormSchema, SignInFormType } from '@repo/shared/types';
import { FormErrorMessage, Input, Label, Skeleton } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Clock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const EMAIL_DOMAIN = '@gsm.hs.kr';

type SignInLocalFormType = z.infer<typeof SignInFormSchema>;

interface SignInFormProps {
  onSubmit: (data: SignInFormType) => void;
  isPending?: boolean;
  signupHref: string;
  resetHref: string;
  serviceName?: string;
  isLoadingServiceName?: boolean;
  remainingTime?: number | null;
}

const SignInForm = ({
  onSubmit,
  isPending = false,
  signupHref,
  resetHref,
  serviceName,
  isLoadingServiceName = false,
  remainingTime,
}: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInLocalFormType>({
    resolver: zodResolver(SignInFormSchema),
  });

  const handleFormSubmit = handleSubmit((data) =>
    onSubmit({ email: `${data.email}${EMAIL_DOMAIN}`, password: data.password }),
  );

  return (
    <div
      className={cn('w-full max-w-sm border-2 border-foreground bg-background pixel-shadow-lg')}
    >
      {/* Title bar */}
      <div className={cn('flex items-center gap-3 border-b-2 border-foreground bg-foreground px-5 py-3')}>
        <div
          className={cn(
            'flex h-6 w-6 flex-shrink-0 items-center justify-center bg-background text-foreground font-pixel text-[8px]',
          )}
        >
          D
        </div>
        <span
          className={cn('text-background font-pixel text-[9px]')}
        >
          DataGSM
        </span>
      </div>

      {/* Header */}
      <div className={cn('border-b border-border/50 px-6 py-5')}>
        <h1 className={cn('text-xl font-bold text-foreground')}>로그인</h1>
        {isLoadingServiceName ? (
          <Skeleton className={cn('mt-2 h-4 w-48')} />
        ) : (
          <p className={cn('mt-1 text-sm text-muted-foreground')}>
            DataGSM 계정으로{' '}
            {serviceName ? (
              <>
                <strong className={cn('font-semibold text-foreground')}>{serviceName}</strong>에{' '}
              </>
            ) : (
              ''
            )}
            로그인하세요
          </p>
        )}
      </div>

      {remainingTime !== null && remainingTime !== undefined && remainingTime <= 300 && (
        <div
          className={cn(
            'mx-6 mt-4 flex items-center gap-2 border px-3 py-2 text-xs font-medium font-mono',
            remainingTime <= 30
              ? 'border-destructive text-destructive'
              : 'border-amber-600 text-amber-600',
          )}
        >
          <Clock className={cn('h-3.5 w-3.5 flex-shrink-0')} />
          <span>세션만료: {formatTime(remainingTime)}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className={cn('space-y-4 px-6 pt-5')}>
          {/* Email */}
          <div className={cn('space-y-1.5')}>
            <Label
              htmlFor="emailLocal"
              className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}
            >
              Email
            </Label>
            <div className={cn('flex')}>
              <Input
                id="emailLocal"
                type="text"
                placeholder="이메일을 입력하세요"
                {...register('email')}
                disabled={isPending}
                className={cn('flex-1 rounded-none border-foreground focus-visible:ring-0 focus-visible:border-foreground')}
              />
              <span
                className={cn(
                  'flex items-center whitespace-nowrap border border-l-0 border-foreground bg-muted px-3 text-xs text-muted-foreground font-mono',
                )}
              >
                {EMAIL_DOMAIN}
              </span>
            </div>
            <FormErrorMessage error={errors.email} />
          </div>

          {/* Password */}
          <div className={cn('space-y-1.5')}>
            <Label
              htmlFor="password"
              className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}
            >
              Password
            </Label>
            <div className={cn('relative')}>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                {...register('password')}
                disabled={isPending}
                className={cn('rounded-none border-foreground pr-10 focus-visible:ring-0 focus-visible:border-foreground')}
              />
              <button
                type="button"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground',
                  isPending && 'cursor-not-allowed opacity-50',
                )}
                disabled={isPending}
              >
                {showPassword ? (
                  <EyeOff className={cn('h-4 w-4')} />
                ) : (
                  <Eye className={cn('h-4 w-4')} />
                )}
              </button>
            </div>
            <FormErrorMessage error={errors.password} />
          </div>
        </div>

        <div className={cn('space-y-3 px-6 pb-6 pt-5')}>
          <button
            type="submit"
            className={cn(
              'w-full cursor-pointer border-2 border-foreground bg-foreground px-4 py-3 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 font-mono',
            )}
            disabled={isPending}
          >
            {isPending ? 'SIGNING IN...' : 'SIGN IN'}
          </button>

          {signupHref && (
            <div className={cn('space-y-1 pt-1 text-center text-xs')}>
              <p className={cn('text-muted-foreground')}>
                계정이 없으신가요?{' '}
                <Link
                  href={signupHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('font-semibold text-foreground underline underline-offset-2')}
                >
                  회원가입
                </Link>
              </p>
              <p>
                <Link
                  href={resetHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground',
                  )}
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
