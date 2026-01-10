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
import { cn } from '@repo/shared/utils';
import { Check, Database } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SignUpFormSchema, SignUpFormType } from '@/entities/signup';
import { useDebounce } from '@/shared/hooks';
import { useCheckEmailCode, useSendEmailCode, useSignUp } from '@/widgets/signup';

const SignUpForm = () => {
  const [codeSent, setCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
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

  const { mutate: sendEmailCode, isPending: isSendingCode } = useSendEmailCode({
    onSuccess: () => {
      setCodeSent(true);
      toast.success('인증번호가 이메일로 전송되었습니다.');
    },
    onError: () => {
      toast.error('인증번호 전송에 실패했습니다.');
    },
  });

  const {
    data: checkResult,
    isLoading: isCheckingCode,
    isError: isCheckError,
  } = useCheckEmailCode(emailValue || '', debouncedCode || '', {
    enabled: codeSent && !!debouncedCode && debouncedCode.length === 8,
  });

  useEffect(() => {
    if (checkResult?.status === 'OK') {
      setIsCodeVerified(true);
      if (!isCodeVerified) {
        toast.success('인증번호가 확인되었습니다.');
      }
    } else if (isCheckError) {
      setIsCodeVerified(false);
      toast.error('인증번호가 일치하지 않습니다.');
    }
  }, [checkResult, isCheckError, isCodeVerified]);

  const { mutate: signUp, isPending: isSigningUp } = useSignUp({
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push('/signin');
    },
    onError: () => {
      toast.error('회원가입에 실패했습니다.');
    },
  });

  const handleSendCode = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;

    const email = getValues('email');
    sendEmailCode({ email });
  };

  const onSubmit: SubmitHandler<SignUpFormType> = (data) => {
    if (!isCodeVerified) {
      toast.error('인증번호를 확인해주세요.');
      return;
    }
    signUp(data);
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gsm.hs.kr"
                  {...register('email')}
                  disabled={codeSent}
                />
                <FormErrorMessage error={errors.email} />
              </div>
              <Button
                type="button"
                onClick={handleSendCode}
                className="whitespace-nowrap"
                disabled={isSendingCode || codeSent || !emailValue}
              >
                {isSendingCode ? '전송 중...' : codeSent ? '전송됨' : '인증번호'}
              </Button>
            </div>
            <div className="relative">
              <Input
                id="code"
                type="text"
                placeholder="메일로 받은 인증번호를 입력하세요"
                {...register('code')}
                disabled={!codeSent}
                className={cn(isCodeVerified && 'pr-10')}
              />
              {isCodeVerified && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              )}
            </div>
            {isCheckingCode && <p className="text-muted-foreground text-xs">인증번호 확인 중...</p>}
            <FormErrorMessage error={errors.code} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              className="w-full"
              disabled={isSigningUp || !codeSent || !isCodeVerified}
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register('password')}
            />
            <FormErrorMessage error={errors.password} />
          </div>
        </CardContent>

        <CardFooter className="mt-6 flex flex-col space-y-4">
          <Button type="submit" className="w-full" size="lg" disabled={isSigningUp || !codeSent}>
            {isSigningUp ? '처리 중...' : '회원가입'}
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
