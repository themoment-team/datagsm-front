import { useEffect, useMemo, useState } from 'react';

import { Club, Student } from '@repo/shared/types';
import {
  Badge,
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
import { Pencil, Plus, X } from 'lucide-react';
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { AddClubType } from '@/entities/club';
import { useCreateClub, useUpdateClub } from '@/widgets/clubs';

interface ClubFormDialogProps {
  mode: 'create' | 'edit';
  club?: Club;
  students?: Student[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoadingStudents?: boolean;
  form: UseFormReturn<AddClubType>;
}

const ClubFormDialog = ({
  mode,
  club,
  students,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  isLoadingStudents = false,
  form,
}: ClubFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const currentLeaderId = watch('leaderId');

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const leaderIdNum = currentLeaderId ? Number(currentLeaderId) : undefined;
    return students?.filter(
      (student) =>
        (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (student.studentNumber?.toString().includes(searchTerm) ?? false) ||
        student.id === leaderIdNum,
    );
  }, [students, searchTerm, currentLeaderId]);

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
      toast.success('동아리 데이터가 수정되었습니다.');
    },
    onError: (error) => {
      console.error('동아리 데이터 수정 실패:', error);
      toast.error('동아리 데이터 수정에 실패했습니다.');
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && club) {
        reset({
          name: club.name,
          type: club.type,
          leaderId: club.leader.id,
          participants: club.participants.map((p) => p.id),
        });
      } else if (mode === 'create') {
        reset({
          name: '',
          type: undefined,
          leaderId: undefined,
          participants: [],
        });
      }
    }
  }, [mode, club, open, reset]);

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  const onSubmit: SubmitHandler<AddClubType> = (data) => {
    if (mode === 'create') {
      createClub(data);
    } else if (mode === 'edit' && club) {
      updateClub({ clubId: club.id, data });
    }
  };

  const isPending = mode === 'create' ? isCreating : isUpdating;
  const title = mode === 'create' ? '동아리 추가' : '동아리 데이터 수정';
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
      <DialogContent className={cn('max-w-2xl')}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6')}>
          <div className={cn('grid grid-cols-2 gap-4 pt-4')}>
            <div className={cn('space-y-2')}>
              <Label htmlFor="name">동아리명</Label>
              <Input id="name" placeholder="동아리명 입력" {...register('name')} />
              <FormErrorMessage error={errors.name} />
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="type">동아리 종류</Label>
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
                    onValueChange={(value) => {
                      const id = Number(value);
                      field.onChange(id);

                      const participants = getValues('participants') || [];
                      if (participants.includes(id)) {
                        setValue(
                          'participants',
                          participants.filter((pId) => pId !== id),
                        );
                      }
                    }}
                  >
                    <SelectTrigger>
                      {field.value ? (
                        <div className={cn('flex gap-2')}>
                          {(() => {
                            const selectedStudent = students?.find(
                              (s) => s.id === Number(field.value),
                            );
                            return selectedStudent
                              ? `${selectedStudent.studentNumber} ${selectedStudent.name}`
                              : '부장 선택';
                          })()}
                        </div>
                      ) : (
                        <SelectValue placeholder="부장 선택" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <div className={cn('bg-popover sticky top-0 z-10 p-2')}>
                        <Input
                          placeholder="이름 또는 학번 검색..."
                          value={searchTerm}
                          autoFocus
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === ' ') e.stopPropagation();
                            e.stopPropagation();
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className={cn('max-h-[200px] overflow-y-auto')}>
                        {filteredStudents && filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.studentNumber} {student.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className={cn('text-muted-foreground p-4 text-center text-sm')}>
                            검색 결과가 없습니다.
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormErrorMessage error={errors.leaderId} />
            </div>

            <div className={cn('space-y-2')}>
              <Label>팀원 추가</Label>
              <Controller
                control={control}
                name="participants"
                render={({ field }) => (
                  <Select
                    value=""
                    onValueChange={(value) => {
                      const id = Number(value);
                      if (Array.isArray(field.value) && !field.value.includes(id)) {
                        field.onChange([...field.value, id]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="팀원 추가" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className={cn('bg-popover sticky top-0 z-10 p-2')}>
                        <Input
                          placeholder="이름 또는 학번 검색..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === ' ') e.stopPropagation();
                            e.stopPropagation();
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className={cn('max-h-[200px] overflow-y-auto')}>
                        {filteredStudents && filteredStudents.length > 0 ? (
                          filteredStudents
                            .filter(
                              (s) =>
                                Array.isArray(field.value) &&
                                !field.value.includes(s.id) &&
                                s.id !== Number(currentLeaderId),
                            )
                            .map((student) => (
                              <SelectItem key={student.id} value={student.id.toString()}>
                                {student.studentNumber} {student.name}
                              </SelectItem>
                            ))
                        ) : (
                          <div className={cn('text-muted-foreground p-4 text-center text-sm')}>
                            검색 결과가 없습니다.
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormErrorMessage
                error={!Array.isArray(errors.participants) ? errors.participants : undefined}
              />
            </div>
          </div>

          <div className={cn('bg-muted/30 flex flex-col gap-6 rounded-xl')}>
            <Label className={cn('text-foreground text-base font-bold')}>팀원</Label>
            <Controller
              control={control}
              name="participants"
              render={({ field }) => {
                const selectedIds = Array.isArray(field.value) ? field.value : [];
                const selectedStudents = students?.filter((s) => selectedIds.includes(s.id)) || [];

                const grades = [1, 2, 3];

                return (
                  <div className={cn('grid grid-cols-3 gap-8')}>
                    {grades.map((grade) => (
                      <div key={grade} className={cn('flex flex-col gap-4')}>
                        <div
                          className={cn(
                            'text-foreground border-primary/20 flex items-center gap-2 border-b-2 pb-2 text-sm font-bold',
                          )}
                        >
                          <span
                            className={cn(
                              'bg-primary flex h-6 w-6 items-center justify-center rounded-full text-[12px] text-white',
                            )}
                          >
                            {grade}
                          </span>
                          {grade}학년
                        </div>
                        <div
                          className={cn(
                            '[&::-webkit-scrollbar-thumb]:bg-border flex max-h-[300px] flex-col gap-2.5 overflow-y-auto overflow-x-hidden pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:w-1',
                          )}
                        >
                          {selectedStudents
                            .filter((s) => s.grade === grade)
                            .map((student) => (
                              <Badge
                                key={student.id}
                                variant="secondary"
                                className={cn(
                                  'hover:bg-secondary/80 flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 transition-colors',
                                )}
                                onClick={() =>
                                  field.onChange(
                                    field.value.filter((id: number) => id !== student.id),
                                  )
                                }
                              >
                                <span className={cn('text-xs font-medium')}>
                                  {student.studentNumber} {student.name}
                                </span>
                                <X
                                  className={cn(
                                    'text-muted-foreground hover:text-destructive h-4 w-4 shrink-0 transition-colors',
                                  )}
                                />
                              </Badge>
                            ))}
                          {selectedStudents.filter((s) => s.grade === grade).length === 0 && (
                            <div
                              className={cn(
                                'text-muted-foreground/40 py-4 text-center text-xs italic',
                              )}
                            >
                              등록된 팀원 없음
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </div>

          <div className={cn('flex justify-end pt-2')}>
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
