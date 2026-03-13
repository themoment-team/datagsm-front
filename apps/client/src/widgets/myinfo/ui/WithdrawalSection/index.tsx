'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { COOKIE_KEYS } from '@repo/shared/constants';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
  Label,
} from '@repo/shared/ui';
import { deleteCookie } from '@repo/shared/utils';
import { AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { WithdrawalFormType, WithdrawalSchema } from '@/entities/mypage';

import { useWithdrawal } from '../../model/useWithdrawal';

export const WithdrawalSection = () => {
  const [open, setOpen] = useState(false);
  const { mutate: withdraw, isPending } = useWithdrawal({
    onSuccess: () => {
      toast.success('회원 탈퇴가 완료되었습니다.');
      deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
      deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);
      window.location.reload();
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error('비밀번호가 일치하지 않습니다.');
      } else {
        toast.error('오류가 발생했습니다.');
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WithdrawalFormType>({
    resolver: zodResolver(WithdrawalSchema),
  });

  const onSubmit = (data: WithdrawalFormType) => {
    withdraw(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <div className="border-destructive/20 bg-destructive/3 flex flex-col items-start justify-between gap-4 rounded-lg border p-6">
        <div>
          <h3 className="text-destructive flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="h-5 w-5" />
            위험 구역
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            계정을 삭제하면 모든 데이터가 영구적으로 제거되며 복구할 수 없습니다.
          </p>
        </div>

        <AlertDialog open={open} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">회원 탈퇴</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 탈퇴하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  탈퇴를 확인하기 위해 비밀번호를 입력해주세요.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="my-6 space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password.message}</p>
                )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel type="button">취소</AlertDialogCancel>
                <Button
                  type="submit"
                  variant="destructive"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isPending}
                >
                  {isPending ? '처리 중...' : '계정 삭제'}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
