'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { cn, minutesToMs } from '@repo/shared/utils';
import { Database } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SignUpFormSchema, SignUpFormType } from '@/entities/signup';
import { useDebounce } from '@/shared/hooks';
import { useCheckEmailCode, useSendEmailCode, useSignUp } from '@/widgets/signup';

const RESEND_COOLDOWN_MS = minutesToMs(5);
const STORAGE_KEY = 'email_verification_timestamp';

const SignUpForm = () => {
  const [codeSent, setCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    watch,
  } = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const codeValue = watch('code');
  const emailValue = watch('email');
  const debouncedCode = useDebounce(codeValue, 1000);

  // 페이지 로드 시 localStorage에서 마지막 전송 시간 확인
  useEffect(() => {
    const lastSentTime = localStorage.getItem(STORAGE_KEY);
    if (lastSentTime) {
      const elapsed = Date.now() - parseInt(lastSentTime, 10);
      if (elapsed < RESEND_COOLDOWN_MS) {
        setCodeSent(true);
        setRemainingTime(Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // 남은 시간 카운트다운
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            localStorage.removeItem(STORAGE_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const { mutate: sendEmailCode, isPending: isSendingCode } = useSendEmailCode({
    onSuccess: () => {
      const timestamp = Date.now();
      localStorage.setItem(STORAGE_KEY, timestamp.toString());
      setCodeSent(true);
      setRemainingTime(RESEND_COOLDOWN_MS / 1000);
      toast.success('인증 코드가 이메일로 전송되었습니다.');
    },
    onError: () => {
      toast.error('인증 코드 전송에 실패했습니다.');
    },
  });

  const { data: checkResult } = useCheckEmailCode(emailValue, debouncedCode, {
    enabled: codeSent && !!debouncedCode && debouncedCode.length === 8,
  });

  useEffect(() => {
    switch (checkResult?.code) {
      case 200:
        setIsCodeVerified(true);
        if (!isCodeVerified) {
          toast.success('인증 코드가 확인되었습니다.');
        }
        break;
      case 400:
        setIsCodeVerified(false);
        toast.error('인증 코드를 입력해주세요.');
        break;
      case 404:
        setIsCodeVerified(false);
        toast.error('인증 코드가 일치하지 않습니다.');
        break;
    }
  }, [checkResult, isCodeVerified]);

  const { mutate: signUp, isPending: isSigningUp } = useSignUp({
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push('/signin');
    },
    onError: (error: unknown) => {
      const errorResponse = error as { response?: { data?: { code?: number } } };
      const statusCode = errorResponse?.response?.data?.code;

      switch (statusCode) {
        case 400:
          toast.error('입력 정보를 확인해주세요.');
          break;
        case 404:
          toast.error('인증 코드가 일치하지 않습니다.');
          break;
        case 409:
          toast.error('이미 존재하는 계정입니다.');
          break;
        default:
          toast.error('회원가입에 실패했습니다.');
      }
    },
  });

  const handleSendCode = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;

    const email = getValues('email');
    sendEmailCode({ email });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canResend = remainingTime === 0;
  const isButtonDisabled =
    isSendingCode || !emailValue || (codeSent && !canResend) || isCodeVerified;

  const onSubmit: SubmitHandler<SignUpFormType> = (data) => {
    if (!isCodeVerified) {
      toast.error('인증 코드를 확인해주세요.');
      return;
    }
    signUp(data);
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
          <CardTitle className={cn('text-3xl')}>회원가입</CardTitle>
          <CardDescription className={cn('mt-2')}>
            @gsm.hs.kr 도메인 계정만 사용 가능합니다
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className={cn('space-y-4')}>
          <div className={cn('space-y-2')}>
            <Label htmlFor="email">이메일</Label>
            <div className={cn('flex gap-2')}>
              <div className={cn('flex-1 space-y-2')}>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gsm.hs.kr"
                  {...register('email')}
                  disabled={remainingTime > 0 || isCodeVerified}
                />
                <FormErrorMessage error={errors.email} />
              </div>
              <Button
                type="button"
                onClick={handleSendCode}
                className={cn('whitespace-nowrap', isButtonDisabled && 'cursor-not-allowed')}
                disabled={isButtonDisabled}
              >
                {isSendingCode
                  ? '전송 중...'
                  : codeSent && !canResend
                    ? `재전송 (${formatTime(remainingTime)})`
                    : codeSent && canResend
                      ? '재전송'
                      : '인증 코드'}
              </Button>
            </div>
            <div className={cn('space-y-2', !codeSent && 'cursor-not-allowed')}>
              <Input
                id="code"
                type="text"
                placeholder="메일로 받은 인증 코드를 입력하세요"
                {...register('code')}
                disabled={!codeSent || isCodeVerified}
              />
              {isCodeVerified && (
                <p className={cn('text-sm text-green-600')}>인증 코드가 확인되었습니다.</p>
              )}
              {!isCodeVerified && <FormErrorMessage error={errors.code} />}
            </div>
          </div>

          <div className={cn('space-y-2')}>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              className={cn('w-full')}
              disabled={isSigningUp}
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register('password')}
            />
            <FormErrorMessage error={errors.password} />
          </div>
        </CardContent>

        <CardFooter className={cn('mt-6 flex flex-col space-y-4')}>
          <Button
            type="submit"
            className={cn('w-full', (isSigningUp || !codeSent) && 'cursor-not-allowed')}
            size="lg"
            disabled={isSigningUp || !codeSent}
          >
            {isSigningUp ? '처리 중...' : '회원가입'}
          </Button>

          <p className={cn('text-muted-foreground text-center text-sm')}>
            이미 계정이 있으신가요?{' '}
            <Link href="/signin" className={cn('text-primary font-medium hover:underline')}>
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUpForm;
