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
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus } from 'lucide-react';
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { AddProjectType } from '@/entities/project';
import { useCreateProject, useUpdateProject } from '@/views/projects/model';

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
  const queryClient = useQueryClient();
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

  const { mutate: createProject } = useCreateProject({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('프로젝트가 등록되었습니다.');
      setOpen(false);
    },
    onError: () => {
      toast.error('프로젝트 등록에 실패했습니다.');
    },
  });

  const { mutate: updateProject } = useUpdateProject({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('프로젝트 데이터가 수정되었습니다.');
      setOpen(false);
    },
    onError: () => {
      toast.error('프로젝트 데이터 수정에 실패했습니다.');
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && project) {
        reset({
          name: project.name,
          description: project.description,
          clubId: project.club?.id || 0,
        });
      } else if (mode === 'create') {
        reset({
          name: '',
          description: '',
          clubId: 0,
        });
      }
    }
  }, [mode, project, open, reset]);

  const onSubmit: SubmitHandler<AddProjectType> = (data) => {
    if (mode === 'create') {
      createProject(data);
    } else if (mode === 'edit' && project) {
      updateProject({ projectId: project.id, data });
    }
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
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="동아리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {clubs.map((club) => (
                        <SelectItem key={club.id} value={String(club.id)}>
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
