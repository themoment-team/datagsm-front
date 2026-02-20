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
import { Checkbox, Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/shared/ui';
import { cn, minutesToMs } from '@repo/shared/utils';
import { AxiosError } from 'axios';
import { Database, Eye, EyeOff } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SignUpFormSchema, SignUpFormType } from '@/entities/signup';
import { useDebounce } from '@/shared/hooks';
import { useCheckEmailCode, useSendEmailCode, useSignUp } from '@/widgets/signup';

import { PRIVACY_POLICY } from '../../constants/privacyPolicy';

const RESEND_COOLDOWN_MS = minutesToMs(5);
const STORAGE_KEY = 'email_verification_timestamp';

const SignUpForm = () => {
  const [codeSent, setCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    watch,
    setValue,
  } = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const codeValue = watch('code');
  const emailValue = watch('email');
  const passwordValue = watch('password');
  const privacyAgreedValue = watch('privacyAgreed');
  const debouncedCode = useDebounce(codeValue, 1000);
  const lastCheckedCode = useRef('');
  const hasShownExpiredToast = useRef(false);

  const isFormValid = SignUpFormSchema.safeParse({
    email: emailValue,
    password: passwordValue,
    code: codeValue,
    privacyAgreed: privacyAgreedValue,
  }).success;

  const handlePrivacyCheckboxClick = () => {
    const isAgreed = getValues('privacyAgreed');
    if (!isAgreed) {
      setHasScrolledToBottom(false);
      setIsPrivacyDialogOpen(true);
    } else {
      setValue('privacyAgreed', false);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handlePrivacyAgree = () => {
    setValue('privacyAgreed', true);
    setIsPrivacyDialogOpen(false);
    setHasScrolledToBottom(false);
  };

  useEffect(() => {
    if (isPrivacyDialogOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isPrivacyDialogOpen]);

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

  const { mutate: sendEmailCode, isPending: isSendingCode } = useSendEmailCode({
    onSuccess: () => {
      const timestamp = Date.now();
      localStorage.setItem(STORAGE_KEY, timestamp.toString());
      setCodeSent(true);
      setRemainingTime(RESEND_COOLDOWN_MS / 1000);
      hasShownExpiredToast.current = false;
      toast.success('인증 코드가 이메일로 전송되었습니다.');
    },
    onError: (error: unknown) => {
      const statusCode =
        error instanceof AxiosError ? (error.response?.data as { code?: number })?.code : undefined;

      switch (statusCode) {
        case 400:
          toast.error('이메일 형식을 확인해주세요.');
          break;
        case 409:
          toast.error('이미 해당 이메일을 가진 계정이 존재합니다.');
          break;
        default:
          toast.error('인증 코드 전송에 실패했습니다.');
      }
    },
  });

  const { mutate: checkEmailCode } = useCheckEmailCode({
    onSuccess: () => {
      setIsCodeVerified(true);
      toast.success('인증 코드가 확인되었습니다.');
    },
    onError: (error: unknown) => {
      const statusCode =
        error instanceof AxiosError ? (error.response?.data as { code?: number })?.code : undefined;

      switch (statusCode) {
        case 400:
          setIsCodeVerified(false);
          toast.error('인증 코드가 일치하지 않습니다.');
          break;
        case 404:
          setIsCodeVerified(false);
          toast.error('인증 코드가 만료되었거나 존재하지 않습니다.');
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

  const { mutate: signUp, isPending: isSigningUp } = useSignUp({
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push('/');
    },
    onError: (error: unknown) => {
      const statusCode =
        error instanceof AxiosError ? (error.response?.data as { code?: number })?.code : undefined;

      switch (statusCode) {
        case 400:
          toast.error('입력 정보를 확인해주세요.');
          break;
        case 404:
          toast.error('인증 코드가 만료되었거나 존재하지 않습니다.');
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
      toast.error('이메일 인증을 완료해주세요.');
      return;
    }
    const { email, password, code } = data;
    signUp({ email, password, code });
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
            <div className={cn('relative')}>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                {...register('password')}
                disabled={isSigningUp}
                className={cn('pr-10')}
              />
              <button
                type="button"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors',
                  isSigningUp && 'cursor-not-allowed opacity-50',
                )}
                disabled={isSigningUp}
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

          <div className={cn('flex items-center space-x-2')}>
            <Checkbox
              id="privacy"
              checked={watch('privacyAgreed')}
              onCheckedChange={handlePrivacyCheckboxClick}
            />
            <label
              htmlFor="privacy"
              className={cn('cursor-pointer text-sm leading-none')}
              onClick={(e) => {
                e.preventDefault();
                handlePrivacyCheckboxClick();
              }}
            >
              <span className={cn('text-primary hover:underline')}>개인정보 처리방침</span>에
              동의합니다
            </label>
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
            {isSigningUp ? '처리 중...' : '회원가입'}
          </Button>

          <p className={cn('text-muted-foreground text-center text-sm')}>
            이미 계정이 있으신가요?{' '}
            <Link href="/" className={cn('text-primary font-medium hover:underline')}>
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>

      <Dialog open={isPrivacyDialogOpen} onOpenChange={setIsPrivacyDialogOpen}>
        <DialogContent className={cn('flex max-h-[80vh] max-w-md flex-col')}>
          <DialogHeader>
            <DialogTitle>개인정보 처리방침</DialogTitle>
          </DialogHeader>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={cn('max-w-none flex-1 overflow-y-auto pr-4')}
          >
            <div className={cn('whitespace-pre-wrap text-sm leading-relaxed')}>
              {PRIVACY_POLICY.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1
                      key={index}
                      className={cn('mb-2 mt-4 text-xl font-bold')}
                      dangerouslySetInnerHTML={{ __html: line.replace('# ', '') }}
                    />
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2
                      key={index}
                      className={cn('mb-2 mt-4 text-lg font-semibold')}
                      dangerouslySetInnerHTML={{ __html: line.replace('## ', '') }}
                    />
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3
                      key={index}
                      className={cn('mb-1 mt-3 text-base font-medium')}
                      dangerouslySetInnerHTML={{ __html: line.replace('### ', '') }}
                    />
                  );
                }
                const trimmedLine = line.trimStart();
                const isNested = line.startsWith('  ');

                if (trimmedLine.startsWith('- ')) {
                  return (
                    <li
                      key={index}
                      className={cn(isNested ? 'ml-14' : 'ml-8')}
                      dangerouslySetInnerHTML={{ __html: trimmedLine.substring(2) }}
                    />
                  );
                }
                if (line.startsWith('  > ')) {
                  return (
                    <blockquote
                      key={index}
                      className={cn(
                        'text-muted-foreground border-muted-foreground ml-8 border-l-2 pl-3 italic',
                      )}
                      dangerouslySetInnerHTML={{ __html: line.replace('  > ', '') }}
                    />
                  );
                }
                return (
                  <p
                    key={index}
                    className={cn('my-2')}
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                );
              })}
            </div>
          </div>
          <div className={cn('flex flex-col gap-2 border-t pt-4')}>
            {!hasScrolledToBottom && (
              <p className={cn('text-muted-foreground text-center text-xs')}>
                내용을 끝까지 읽어주세요
              </p>
            )}
            <Button
              onClick={handlePrivacyAgree}
              disabled={!hasScrolledToBottom}
              className={cn('w-full')}
            >
              동의합니다
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SignUpForm;
