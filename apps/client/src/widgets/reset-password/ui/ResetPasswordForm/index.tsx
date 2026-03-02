'use client';

import { useEffect, useRef, useState } from 'react';

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
import { cn, getApiErrorCode, minutesToMs } from '@repo/shared/utils';
import { AxiosError } from 'axios';
import { Database, Eye, EyeOff } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ResetPasswordFormSchema, ResetPasswordFormType } from '@/entities/reset-password';
import { useDebounce } from '@/shared/hooks';
import {
  useChangePassword,
  useSendPasswordResetEmail,
  useVerifyPasswordResetCode,
} from '@/widgets/reset-password';

const RESEND_COOLDOWN_MS = minutesToMs(5);
const STORAGE_KEY = 'password_reset_verification_timestamp';

const ResetPasswordForm = () => {
  const [codeSent, setCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    watch,
    setValue,
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  const codeValue = watch('code');
  const emailValue = watch('email');
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');
  const debouncedCode = useDebounce(codeValue, 1000);
  const lastCheckedCode = useRef('');
  const hasShownExpiredToast = useRef(false);

  const isFormValid = ResetPasswordFormSchema.safeParse({
    email: emailValue,
    password: passwordValue,
    code: codeValue,
    confirmPassword: confirmPasswordValue,
  }).success;

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
          if (prev === 1) {
            localStorage.removeItem(STORAGE_KEY);
            setCodeSent(false);
            setIsCodeVerified(false);
            lastCheckedCode.current = '';
            setValue('code', '');
            if (!hasShownExpiredToast.current) {
              hasShownExpiredToast.current = true;
              toast.error('인증 시간이 만료되었습니다. 다시 인증해주세요.');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime, setValue]);

  const { mutate: sendEmailCode, isPending: isSendingCode } = useSendPasswordResetEmail({
    onSuccess: () => {
      const timestamp = Date.now();
      localStorage.setItem(STORAGE_KEY, timestamp.toString());
      setCodeSent(true);
      setRemainingTime(RESEND_COOLDOWN_MS / 1000);
      hasShownExpiredToast.current = false;
      toast.success('인증 코드가 이메일로 전송되었습니다.');
    },
    onError: (error: unknown) => {
      const statusCode = getApiErrorCode(error);

      switch (statusCode) {
        case 404:
          toast.error('존재하지 않는 이메일입니다.');
          break;
        case 429:
          toast.error('요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          toast.error('인증 코드 전송에 실패했습니다.');
      }
    },
  });

  const { mutate: checkEmailCode } = useVerifyPasswordResetCode({
    onSuccess: () => {
      setIsCodeVerified(true);
      toast.success('인증 코드가 확인되었습니다.');
    },
    onError: (error: unknown) => {
      const statusCode = getApiErrorCode(error);

      switch (statusCode) {
        case 400:
          setIsCodeVerified(false);
          toast.error('인증 코드가 일치하지 않습니다.');
          break;
        case 404:
          setIsCodeVerified(false);
          toast.error('인증 코드가 만료되었거나 존재하지 않습니다.');
          break;
        case 429:
          setIsCodeVerified(false);
          toast.error('요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          setIsCodeVerified(false);
          toast.error('인증 코드 확인에 실패했습니다.');
      }
    },
  });

  useEffect(() => {
    if (
      codeSent &&
      debouncedCode &&
      debouncedCode.length === 8 &&
      lastCheckedCode.current !== debouncedCode
    ) {
      lastCheckedCode.current = debouncedCode;
      checkEmailCode({ email: emailValue, code: debouncedCode });
    }
  }, [codeSent, debouncedCode, emailValue, checkEmailCode]);

  const { mutate: changePassword, isPending: isSigningUp } = useChangePassword({
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다.');
      setTimeout(() => router.push('/'), 1500);
    },
    onError: (error: unknown) => {
      const statusCode = getApiErrorCode(error);

      switch (statusCode) {
        case 400:
          toast.error('이전 비밀번호와 동일합니다.');
          break;
        case 404:
          toast.error('계정이 존재하지 않습니다.');
          break;
        case 429:
          toast.error('요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          toast.error('비밀번호 변경에 실패했습니다.');
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

  const onSubmit: SubmitHandler<ResetPasswordFormType> = (data) => {
    if (!isCodeVerified) {
      toast.error('이메일 인증을 완료해주세요.');
      return;
    }
    const { email, code, password } = data;
    changePassword({ email, code, newPassword: password });
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
          <CardTitle className={cn('text-3xl')}>비밀번호 재설정</CardTitle>
          <CardDescription className={cn('mt-2')}>새로운 비밀번호를 설정하세요</CardDescription>
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
            <Label htmlFor="password">새 비밀번호</Label>
            <div className={cn('flex gap-2')}>
              <div className={cn('relative flex-1')}>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="새 비밀번호를 입력하세요"
                  {...register('password')}
                  disabled={!isCodeVerified || isSigningUp}
                  className={cn('pr-10')}
                />
                <button
                  type="button"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors',
                    (!isCodeVerified || isSigningUp) && 'cursor-not-allowed opacity-50',
                  )}
                  disabled={!isCodeVerified || isSigningUp}
                >
                  {showPassword ? (
                    <EyeOff className={cn('h-4 w-4')} />
                  ) : (
                    <Eye className={cn('h-4 w-4')} />
                  )}
                </button>
              </div>
            </div>
            <FormErrorMessage error={errors.password} />
            <div className={cn('relative')}>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력하세요"
                {...register('confirmPassword')}
                disabled={!isCodeVerified || isSigningUp}
                className={cn('pr-10')}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={cn(
                  'text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors',
                  (!isCodeVerified || isSigningUp) && 'cursor-not-allowed opacity-50',
                )}
                disabled={!isCodeVerified || isSigningUp}
              >
                {showConfirmPassword ? (
                  <EyeOff className={cn('h-4 w-4')} />
                ) : (
                  <Eye className={cn('h-4 w-4')} />
                )}
              </button>
            </div>
            <FormErrorMessage error={errors.confirmPassword} />
          </div>
        </CardContent>

        <CardFooter className={cn('mt-6 flex flex-col space-y-4')}>
          <Button
            type="submit"
            className={cn(
              'w-full',
              (isSigningUp || !isCodeVerified || !isFormValid) && 'cursor-not-allowed',
            )}
            size="lg"
            disabled={isSigningUp || !isCodeVerified || !isFormValid}
          >
            {isSigningUp ? '처리 중...' : '비밀번호 재설정'}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            <Link href="/signin" className="text-primary font-medium hover:underline">
              로그인으로 돌아가기
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;
