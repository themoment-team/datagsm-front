'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from '@repo/shared/hooks';
import { FormErrorMessage, Input, Label } from '@repo/shared/ui';
import { cn, getApiErrorCode, minutesToMs } from '@repo/shared/utils';
import { Eye, EyeOff } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ResetPasswordFormSchema, ResetPasswordFormType } from '@/entities/reset-password';
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

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev === 1) {
            localStorage.removeItem(STORAGE_KEY);
            setCodeSent(false);
            if (!isCodeVerified) {
              setIsCodeVerified(false);
              lastCheckedCode.current = '';
              setValue('code', '');
              if (!hasShownExpiredToast.current) {
                hasShownExpiredToast.current = true;
                toast.error('인증 시간이 만료되었습니다. 다시 인증해주세요.');
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime, setValue, isCodeVerified]);

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

  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword({
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
    <div
      className={cn('w-full max-w-md border-2 border-foreground bg-background pixel-shadow-lg')}
    >
      {/* Title bar */}
      <div
        className={cn(
          'flex items-center gap-3 border-b-2 border-foreground bg-foreground px-5 py-3',
        )}
      >
        <div
          className={cn(
            'flex h-6 w-6 flex-shrink-0 items-center justify-center bg-background text-foreground text-[8px] font-pixel',
          )}
        >
          D
        </div>
        <span className={cn('text-[9px] text-background font-pixel')}>
          DataGSM
        </span>
      </div>

      {/* Header */}
      <div className={cn('border-b border-border/50 px-6 py-5')}>
        <h1 className={cn('text-xl font-bold text-foreground')}>비밀번호 재설정</h1>
        <p className={cn('mt-1 text-sm text-muted-foreground')}>새로운 비밀번호를 설정하세요</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cn('space-y-4 px-6 pt-5')}>
          {/* Email + code send */}
          <div className={cn('space-y-1.5')}>
            <Label
              htmlFor="email"
              className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}
            >
              Email
            </Label>
            <div className={cn('flex gap-2')}>
              <div className={cn('flex-1 space-y-1')}>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gsm.hs.kr"
                  {...register('email')}
                  disabled={remainingTime > 0 || isCodeVerified}
                  className={cn(
                    'rounded-none border-foreground focus-visible:ring-0 focus-visible:border-foreground',
                  )}
                />
                <FormErrorMessage error={errors.email} />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isButtonDisabled}
                className={cn(
                  'h-9 flex-shrink-0 cursor-pointer border-2 border-foreground bg-foreground px-3 text-xs uppercase tracking-wider text-background transition-all hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 font-mono',
                )}
              >
                {isSendingCode
                  ? '전송 중'
                  : codeSent && !canResend
                    ? formatTime(remainingTime)
                    : codeSent && canResend
                      ? '재전송'
                      : '인증코드'}
              </button>
            </div>
          </div>

          {/* Verification code */}
          <div className={cn('space-y-1.5', !codeSent && 'cursor-not-allowed')}>
            <Label
              htmlFor="code"
              className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}
            >
              Verify Code
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="메일로 받은 인증 코드를 입력하세요"
              {...register('code')}
              disabled={!codeSent || isCodeVerified}
              className={cn(
                'rounded-none border-foreground focus-visible:ring-0 focus-visible:border-foreground',
              )}
            />
            {isCodeVerified ? (
              <p className={cn('text-xs text-green-600 font-mono')}>
                {'>'} 인증 완료
              </p>
            ) : (
              <FormErrorMessage error={errors.code} />
            )}
          </div>

          {/* New password */}
          <div className={cn('space-y-1.5')}>
            <Label
              htmlFor="password"
              className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}
            >
              New Password
            </Label>
            <div className={cn('relative')}>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="새 비밀번호를 입력하세요"
                {...register('password')}
                disabled={!isCodeVerified || isChangingPassword}
                className={cn(
                  'rounded-none border-foreground pr-10 focus-visible:ring-0 focus-visible:border-foreground',
                )}
              />
              <button
                type="button"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground',
                  (!isCodeVerified || isChangingPassword) && 'cursor-not-allowed opacity-50',
                )}
                disabled={!isCodeVerified || isChangingPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FormErrorMessage error={errors.password} />
          </div>

          {/* Confirm password */}
          <div className={cn('space-y-1.5')}>
            <Label
              htmlFor="confirmPassword"
              className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}
            >
              Confirm Password
            </Label>
            <div className={cn('relative')}>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력하세요"
                {...register('confirmPassword')}
                disabled={!isCodeVerified || isChangingPassword}
                className={cn(
                  'rounded-none border-foreground pr-10 focus-visible:ring-0 focus-visible:border-foreground',
                )}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground',
                  (!isCodeVerified || isChangingPassword) && 'cursor-not-allowed opacity-50',
                )}
                disabled={!isCodeVerified || isChangingPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FormErrorMessage error={errors.confirmPassword} />
          </div>
        </div>

        <div className={cn('space-y-3 px-6 pb-6 pt-5')}>
          <button
            type="submit"
            className={cn(
              'w-full cursor-pointer border-2 border-foreground bg-foreground py-3 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 font-mono',
            )}
            disabled={isChangingPassword || !isCodeVerified || !isFormValid}
          >
            {isChangingPassword ? 'PROCESSING...' : 'RESET PASSWORD'}
          </button>

          <p className={cn('text-center text-xs text-muted-foreground')}>
            <Link
              href="/signin"
              className={cn('font-semibold text-foreground underline underline-offset-2')}
            >
              로그인으로 돌아가기
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
