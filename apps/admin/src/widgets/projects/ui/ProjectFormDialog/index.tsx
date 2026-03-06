import { useEffect, useState } from 'react';

import { Club, Project } from '@repo/shared/types';
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
  Textarea,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Pencil, Plus } from 'lucide-react';
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form';

import { AddProjectType } from '@/entities/project';

interface ProjectFormDialogProps {
  mode: 'create' | 'edit';
  project?: Project;
  clubs: Club[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  form: UseFormReturn<AddProjectType>;
}

const ProjectFormDialog = ({
  mode,
  project,
  clubs,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  form,
}: ProjectFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && project) {
        reset({
          name: project.name,
          description: project.description,
          clubId: project.club?.id.toString() || '',
        });
      } else if (mode === 'create') {
        reset({
          name: '',
          description: '',
          clubId: '',
        });
      }
    }
  }, [mode, project, open, reset]);

  const onSubmit: SubmitHandler<AddProjectType> = (data) => {
    console.log('Project Form Data:', data);
    // API 연동 전까지 콘솔 로그로 대체
    setOpen(false);
  };

  const title = mode === 'create' ? '프로젝트 추가' : '프로젝트 데이터 수정';
  const submitText = mode === 'create' ? '추가' : '수정';

  const defaultTrigger =
    mode === 'create' ? (
      <Button size="sm" className={cn('gap-2')}>
        <Plus className={cn('h-4 w-4')} />
        프로젝트 추가
      </Button>
    ) : (
      <Button variant="ghost" size="icon">
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
              <Label htmlFor="name">프로젝트명</Label>
              <Input id="name" placeholder="프로젝트명 입력" {...register('name')} />
              <FormErrorMessage error={errors.name} />
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="프로젝트 설명 입력"
                className={cn('min-h-[100px] resize-none')}
                {...register('description')}
              />
              <FormErrorMessage error={errors.description} />
            </div>
            <div className={cn('space-y-2')}>
              <Label htmlFor="clubId">동아리</Label>
              <Controller
                control={control}
                name="clubId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="동아리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {clubs.map((club) => (
                        <SelectItem key={club.id} value={club.id.toString()}>
                          {club.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FormErrorMessage error={errors.clubId} />
            </div>
          </div>
          <div className={cn('flex justify-end pt-2')}>
            <Button type="submit">{submitText}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
