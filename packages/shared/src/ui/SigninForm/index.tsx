'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Database } from 'lucide-react';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in with:', { email, password });
  };

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

      <form onSubmit={handleSubmit}>
        <CardContent className={cn('space-y-4')}>
          <div className={cn('space-y-2')}>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gsm.hs.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={cn('space-y-2')}>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>

        <CardFooter className={cn('mt-6 flex flex-col space-y-4')}>
          <Button type="submit" className={cn('w-full')} size="lg">
            로그인
          </Button>

          <p className={cn('text-muted-foreground text-center text-sm')}>
            계정이 없으신가요?{' '}
            <Link href="/signup" className={cn('text-primary font-medium hover:underline')}>
              회원가입
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignInForm;
