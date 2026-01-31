import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Club, Student } from '@repo/shared/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormErrorMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus } from 'lucide-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AddClubSchema, AddClubType } from '@/entities/club';
import { useCreateClub, useUpdateClub } from '@/widgets/clubs';

interface ClubFormDialogProps {
  mode: 'create' | 'edit';
  club?: Club;
  students?: Student[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoadingStudents?: boolean;
}

const ClubFormDialog = ({
  mode,
  club,
  students,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  isLoadingStudents = false,
}: ClubFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createClub } = useCreateClub({
    onSuccess: () => {
      setOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('동아리 등록에 성공했습니다.');
    },
    onError: (error) => {
      console.error('동아리 등록 실패:', error);
      toast.error('동아리 등록에 실패했습니다.');
    },
  });

  const { isPending: isUpdating, mutate: updateClub } = useUpdateClub({
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('동아리 정보가 수정되었습니다.');
    },
    onError: (error) => {
      console.error('동아리 정보 수정 실패:', error);
      toast.error('동아리 정보 수정에 실패했습니다.');
    },
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AddClubType>({
    resolver: zodResolver(AddClubSchema),
    defaultValues:
      mode === 'edit' && club
        ? {
            name: club.name,
            type: club.type,
            leaderId: club.leader.id,
          }
        : undefined,
  });

  useEffect(() => {
    if (mode === 'edit' && club && open) {
      reset({
        name: club.name,
        type: club.type,
        leaderId: club.leader.id,
      });
    }
  }, [mode, club, open, reset]);

  const onSubmit: SubmitHandler<AddClubType> = (data) => {
    if (mode === 'create') {
      createClub(data);
    } else if (mode === 'edit' && club) {
      updateClub({ clubId: club.id, data });
    }
  };

  const isPending = mode === 'create' ? isCreating : isUpdating;
  const title = mode === 'create' ? '동아리 추가' : '동아리 정보 수정';
  const submitText = mode === 'create' ? '추가' : '수정';
  const loadingText = mode === 'create' ? '추가 중...' : '수정 중...';

  const defaultTrigger =
    mode === 'create' ? (
      <Button size="sm" className={cn('gap-2')} disabled={isLoadingStudents}>
        <Plus className={cn('h-4 w-4')} />
        동아리 추가
      </Button>
    ) : (
      <Button variant="ghost" size="icon" disabled={isLoadingStudents}>
        <Pencil className={cn('h-4 w-4')} />
      </Button>
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      {!isControlled && <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>}
      <DialogContent className={cn('max-w-md')}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4')}>
          <div className={cn('space-y-4 py-4')}>
            <div className={cn('space-y-2')}>
              <Label htmlFor="name">동아리명</Label>
              <Input id="name" placeholder="동아리명 입력" {...register('name')} />
              <FormErrorMessage error={errors.name} />
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="type">동아리 타입</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="타입 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAJOR_CLUB">전공</SelectItem>
                      <SelectItem value="JOB_CLUB">취업</SelectItem>
                      <SelectItem value="AUTONOMOUS_CLUB">자율</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormErrorMessage error={errors.type} />
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="leaderId">부장</Label>
              <Controller
                control={control}
                name="leaderId"
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="부장 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.studentNumber} {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FormErrorMessage error={errors.leaderId} />
            </div>
          </div>
          <div className={cn('flex justify-end')}>
            <Button type="submit" disabled={isPending}>
              {isPending ? loadingText : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClubFormDialog;
