'use client';

import { useState } from 'react';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { SignInFormSchema, SignInFormType } from '@repo/shared/types';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormErrorMessage,
  Input,
  Label,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Database, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const EMAIL_DOMAIN = '@gsm.hs.kr';

type SignInLocalFormType = z.infer<typeof SignInFormSchema>;

interface SignInFormProps {
  onSubmit: (data: SignInFormType) => void;
  isPending?: boolean;
  signupHref?: string;
  serviceName?: string;
}

const SignInForm = ({ onSubmit, isPending = false, signupHref, serviceName }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
    <Card className={cn('w-full max-w-md')}>
      <CardHeader className={cn('space-y-4 text-center')}>
        <div
          className={cn(
            'bg-primary/10 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full',
          )}
        >
          <Database className={cn('text-primary h-8 w-8')} />
        </div>
        <div>
          <CardTitle className={cn('text-3xl')}>로그인</CardTitle>
          <CardDescription className={cn('mt-2')}>
            DataGSM 계정으로{' '}
            {serviceName ? (
              <>
                <strong className={cn('text-primary')}>{serviceName}</strong>에{' '}
              </>
            ) : (
              ''
            )}
            로그인하세요
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleFormSubmit}>
        <CardContent className={cn('space-y-4')}>
          <div className={cn('space-y-2')}>
            <Label htmlFor="emailLocal">이메일</Label>
            <div className={cn('flex items-center')}>
              <Input
                id="emailLocal"
                type="text"
                placeholder="이메일을 입력하세요"
                {...register('email')}
                disabled={isPending}
                className={cn('rounded-r-none')}
              />
              <span
                className={cn(
                  'border-input bg-muted text-muted-foreground flex h-9 items-center whitespace-nowrap rounded-r-md border border-l-0 px-3 text-sm',
                )}
              >
                {EMAIL_DOMAIN}
              </span>
            </div>
            <FormErrorMessage error={errors.email} />
          </div>

          <div className={cn('space-y-2')}>
            <Label htmlFor="password">비밀번호</Label>
            <div className={cn('relative')}>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                {...register('password')}
                disabled={isPending}
                className={cn('pr-10')}
              />
              <button
                type="button"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors',
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
        </CardContent>

        <CardFooter className={cn('mt-6 flex flex-col space-y-4')}>
          <Button
            type="submit"
            className={cn('w-full', isPending && 'cursor-not-allowed')}
            size="lg"
            disabled={isPending}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </Button>

          {signupHref && (
            <div className="space-y-2 text-center text-sm">
              <p className={cn('text-muted-foreground text-center text-sm')}>
                계정이 없으신가요?{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={signupHref}
                  className={cn('text-primary font-medium hover:underline')}
                >
                  회원가입
                </a>
              </p>
              <p>
                <Link
                  href="/signin/reset-password"
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </p>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignInForm;
