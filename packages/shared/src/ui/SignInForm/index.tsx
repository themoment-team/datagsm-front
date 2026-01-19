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

interface SignInFormProps {
  onSubmit: (data: SignInFormType) => void;
  isPending?: boolean;
  signupHref?: string;
}

const SignInForm = ({ onSubmit, isPending = false, signupHref }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(SignInFormSchema),
  });

  const handleFormSubmit = handleSubmit(onSubmit);

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
          <CardDescription className={cn('mt-2')}>Data GSM 계정으로 로그인하세요</CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleFormSubmit}>
        <CardContent className={cn('space-y-4')}>
          <div className={cn('space-y-2')}>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gsm.hs.kr"
              {...register('email')}
              disabled={isPending}
            />
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
            <p className={cn('text-muted-foreground text-center text-sm')}>
              계정이 없으신가요?{' '}
              <Link href={signupHref} className={cn('text-primary font-medium hover:underline')}>
                회원가입
              </Link>
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignInForm;
