import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClubListData, Student } from '@repo/shared/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { AddStudentSchema, AddStudentType } from '@/entities/student';
import { useCreateStudent, useUpdateStudent } from '@/widgets/students';

interface StudentFormDialogProps {
  clubs?: ClubListData;
  mode: 'create' | 'edit';
  student?: Student;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const StudentFormDialog = ({
  clubs,
  mode,
  student,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: StudentFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createStudent } = useCreateStudent({
    onSuccess: () => {
      setOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('학생 등록에 성공했습니다.');
    },
    onError: (error) => {
      console.error('학생 등록 실패:', error);
      toast.error('학생 등록에 실패했습니다.');
    },
  });

  const { isPending: isUpdating, mutate: updateStudent } = useUpdateStudent(student?.id || 0, {
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('학생 정보가 수정되었습니다.');
    },
    onError: (error) => {
      console.error('학생 정보 수정 실패:', error);
      toast.error('학생 정보 수정에 실패했습니다.');
    },
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AddStudentType>({
    resolver: zodResolver(AddStudentSchema),
    defaultValues:
      mode === 'edit' && student
        ? {
            name: student.name,
            sex: student.sex,
            email: student.email,
            grade: student.grade,
            classNum: student.classNum,
            number: student.number,
            role: student.role,
            dormitoryRoomNumber: student.dormitoryRoom,
            isLeaveSchool: student.isLeaveSchool,
            majorClubId: student.majorClub?.id || null,
            jobClubId: student.jobClub?.id || null,
            autonomousClubId: student.autonomousClub?.id || null,
          }
        : undefined,
  });

  useEffect(() => {
    if (mode === 'edit' && student && open) {
      reset({
        name: student.name,
        sex: student.sex,
        email: student.email,
        grade: student.grade,
        classNum: student.classNum,
        number: student.number,
        role: student.role,
        dormitoryRoomNumber: student.dormitoryRoom,
        isLeaveSchool: student.isLeaveSchool,
        majorClubId: student.majorClub?.id || null,
        jobClubId: student.jobClub?.id || null,
        autonomousClubId: student.autonomousClub?.id || null,
      });
    }
  }, [mode, student, open, reset]);

  const onSubmit: SubmitHandler<AddStudentType> = (data) => {
    if (mode === 'create') {
      createStudent(data);
    } else {
      updateStudent(data);
    }
  };

  const isPending = mode === 'create' ? isCreating : isUpdating;
  const title = mode === 'create' ? '학생 추가' : '학생 정보 수정';
  const submitText = mode === 'create' ? '추가' : '수정';
  const loadingText = mode === 'create' ? '추가 중...' : '수정 중...';

  const defaultTrigger =
    mode === 'create' ? (
      <Button size="sm" className={cn('cursor-pointer gap-2')}>
        <Plus className={cn('h-4 w-4')} />
        학생 추가
      </Button>
    ) : (
      <Button variant="ghost" size="icon" className={cn('cursor-pointer')}>
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
      <DialogContent className={cn('max-h-[90vh] max-w-2xl overflow-y-auto')}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4')}>
          <div className={cn('grid grid-cols-2 gap-4 py-4')}>
            <div className={cn('space-y-2')}>
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="이름 입력" {...register('name')} />
              {errors.name && <p className={cn('text-sm text-red-500')}>{errors.name.message}</p>}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="sex">성별</Label>
              <Controller
                control={control}
                name="sex"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={cn('cursor-pointer')}>
                      <SelectValue placeholder="성별 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAN" className={cn('cursor-pointer')}>
                        남
                      </SelectItem>
                      <SelectItem value="WOMAN" className={cn('cursor-pointer')}>
                        여
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sex && <p className={cn('text-sm text-red-500')}>{errors.sex.message}</p>}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="email">이메일</Label>
              <Input id="email" placeholder="example@gsm.hs.kr" {...register('email')} />
              {errors.email && <p className={cn('text-sm text-red-500')}>{errors.email.message}</p>}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="grade">학년</Label>
              <Controller
                control={control}
                name="grade"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className={cn('cursor-pointer')}>
                      <SelectValue placeholder="학년 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className={cn('cursor-pointer')}>
                        1학년
                      </SelectItem>
                      <SelectItem value="2" className={cn('cursor-pointer')}>
                        2학년
                      </SelectItem>
                      <SelectItem value="3" className={cn('cursor-pointer')}>
                        3학년
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.grade && <p className={cn('text-sm text-red-500')}>{errors.grade.message}</p>}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="classNum">반</Label>
              <Controller
                control={control}
                name="classNum"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className={cn('cursor-pointer')}>
                      <SelectValue placeholder="반 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className={cn('cursor-pointer')}>
                        1반
                      </SelectItem>
                      <SelectItem value="2" className={cn('cursor-pointer')}>
                        2반
                      </SelectItem>
                      <SelectItem value="3" className={cn('cursor-pointer')}>
                        3반
                      </SelectItem>
                      <SelectItem value="4" className={cn('cursor-pointer')}>
                        4반
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.classNum && (
                <p className={cn('text-sm text-red-500')}>{errors.classNum.message}</p>
              )}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="number">번호</Label>
              <Input
                id="number"
                type="number"
                placeholder="번호 입력"
                {...register('number', { valueAsNumber: true })}
              />
              {errors.number && (
                <p className={cn('text-sm text-red-500')}>{errors.number.message}</p>
              )}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="role">구분</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={cn('cursor-pointer')}>
                      <SelectValue placeholder="구분 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL_STUDENT" className={cn('cursor-pointer')}>
                        일반학생
                      </SelectItem>
                      <SelectItem value="STUDENT_COUNCIL" className={cn('cursor-pointer')}>
                        학생회
                      </SelectItem>
                      <SelectItem value="DORMITORY_MANAGER" className={cn('cursor-pointer')}>
                        기자위
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className={cn('text-sm text-red-500')}>{errors.role.message}</p>}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="dormitoryRoomNumber">기숙사 호실</Label>
              <Input
                id="dormitoryRoomNumber"
                type="number"
                placeholder="호실 입력"
                {...register('dormitoryRoomNumber', { valueAsNumber: true })}
              />
              {errors.dormitoryRoomNumber && (
                <p className={cn('text-sm text-red-500')}>{errors.dormitoryRoomNumber.message}</p>
              )}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="majorClubId">전공 동아리</Label>
              <Controller
                control={control}
                name="majorClubId"
                render={({ field }) => (
                  <Select
                    value={
                      field.value === null && mode === 'edit'
                        ? 'none'
                        : field.value
                          ? String(field.value)
                          : undefined
                    }
                    onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                  >
                    <SelectTrigger className={cn('cursor-pointer')}>
                      <SelectValue placeholder="전공 동아리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className={cn('cursor-pointer text-gray-500')}>
                        선택 안 함
                      </SelectItem>
                      {clubs?.clubs
                        .filter((club) => club.type === 'MAJOR_CLUB')
                        .map((club) => (
                          <SelectItem
                            key={club.id}
                            value={String(club.id)}
                            className={cn('cursor-pointer')}
                          >
                            {club.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.majorClubId && (
                <p className={cn('text-sm text-red-500')}>{errors.majorClubId.message}</p>
              )}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="jobClubId">취업 동아리</Label>
              <Controller
                control={control}
                name="jobClubId"
                render={({ field }) => (
                  <Select
                    value={
                      field.value === null && mode === 'edit'
                        ? 'none'
                        : field.value
                          ? String(field.value)
                          : undefined
                    }
                    onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                  >
                    <SelectTrigger className={cn('cursor-pointer')}>
                      <SelectValue placeholder="취업 동아리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className={cn('cursor-pointer text-gray-500')}>
                        선택 안 함
                      </SelectItem>
                      {clubs?.clubs
                        .filter((club) => club.type === 'JOB_CLUB')
                        .map((club) => (
                          <SelectItem
                            key={club.id}
                            value={String(club.id)}
                            className={cn('cursor-pointer')}
                          >
                            {club.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.jobClubId && (
                <p className={cn('text-sm text-red-500')}>{errors.jobClubId.message}</p>
              )}
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="autonomousClubId">자율 동아리</Label>
              <Controller
                control={control}
                name="autonomousClubId"
                render={({ field }) => (
                  <Select
                    value={
                      field.value === null && mode === 'edit'
                        ? 'none'
                        : field.value
                          ? String(field.value)
                          : undefined
                    }
                    onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                  >
                    <SelectTrigger className={cn('cursor-pointer')}>
                      <SelectValue placeholder="자율 동아리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className={cn('cursor-pointer text-gray-500')}>
                        선택 안 함
                      </SelectItem>
                      {clubs?.clubs
                        .filter((club) => club.type === 'AUTONOMOUS_CLUB')
                        .map((club) => (
                          <SelectItem
                            key={club.id}
                            value={String(club.id)}
                            className={cn('cursor-pointer')}
                          >
                            {club.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.autonomousClubId && (
                <p className={cn('text-sm text-red-500')}>{errors.autonomousClubId.message}</p>
              )}
            </div>
            {mode === 'edit' && (
              <div className={cn('space-y-2')}>
                <Label htmlFor="isLeaveSchool">자퇴 여부</Label>
                <Controller
                  control={control}
                  name="isLeaveSchool"
                  render={({ field }) => (
                    <Select
                      value={field.value ? 'true' : 'false'}
                      onValueChange={(val) => field.onChange(val === 'true')}
                    >
                      <SelectTrigger className={cn('cursor-pointer')}>
                        <SelectValue placeholder="자퇴 여부 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false" className={cn('cursor-pointer')}>
                          재학중
                        </SelectItem>
                        <SelectItem value="true" className={cn('cursor-pointer')}>
                          자퇴
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.isLeaveSchool && (
                  <p className={cn('text-sm text-red-500')}>{errors.isLeaveSchool.message}</p>
                )}
              </div>
            )}
          </div>
          <div className={cn('flex justify-end')}>
            <Button type="submit" className={cn('cursor-pointer')} disabled={isPending}>
              {isPending ? loadingText : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentFormDialog;
