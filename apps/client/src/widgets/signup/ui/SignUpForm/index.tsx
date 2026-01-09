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

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) return;

    setIsLoading(true);
    // Simulate sending verification code
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCodeSent(true);
    setIsLoading(false);
    console.log('Verification code sent to:', email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up with:', { email, password, verificationCode });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4 text-center">
        <div className="bg-primary/10 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full">
          <Database className="text-primary h-8 w-8" />
        </div>
        <div>
          <CardTitle className="text-3xl">회원가입</CardTitle>
          <CardDescription className="mt-2">
            @gsm.hs.kr 도메인 계정만 사용 가능합니다
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="example@gsm.hs.kr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={codeSent}
              />
              <Button type="button" onClick={handleSendCode} className="whitespace-nowrap">
                {isLoading ? '전송 중...' : codeSent ? '전송됨' : '인증번호'}
              </Button>
            </div>
          </div>

          <div>
            <Input
              id="code"
              type="text"
              placeholder="메일로 받은 인증번호를 입력하세요"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              disabled={!codeSent}
            />
          </div>

          <div className="space-y-2">
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

        <CardFooter className="mt-6 flex flex-col space-y-4">
          <Button type="submit" className="w-full" size="lg">
            회원가입
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            이미 계정이 있으신가요?{' '}
            <Link href="/signin" className="text-primary font-medium hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUpForm;
