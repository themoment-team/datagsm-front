'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
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
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Plus, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Application, ApplicationFormSchema, ApplicationFormType } from '@/entities/application';
import { useCreateApplication } from '@/widgets/application';

interface ApplicationFormDialogProps {
  mode: 'create' | 'edit';
  application?: Application;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ApplicationFormDialog = ({
  mode,
  application,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ApplicationFormDialogProps) => {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const { mutate: createApplication, isPending: isCreatePending } = useCreateApplication();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormType>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: {
      applicationName: '',
      applicationScopes: [{ applicationScope: '', applicationDescription: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'applicationScopes',
  });

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && application) {
      reset({
        applicationName: application.applicationName,
        applicationScopes: application.applicationScopes,
      });
    } else if (mode === 'create') {
      reset({
        applicationName: '',
        applicationScopes: [{ applicationScope: '', applicationDescription: '' }],
      });
    }
  }, [mode, application, open, reset]);

  const onSubmit = (data: ApplicationFormType) => {
    if (mode === 'create') {
      createApplication(
        {
          name: data.applicationName,
          scopes: data.applicationScopes.map((scope) => ({
            scopeName: scope.applicationScope,
            description: scope.applicationDescription,
          })),
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['applications', 'list'],
            });
            toast.success('애플리케이션이 생성되었습니다.');
            setOpen(false);
            reset();
          },
          onError: () => {
            toast.error('애플리케이션 생성에 실패했습니다.');
          },
        },
      );
    } else {
      // Edit logic not implemented yet
      toast.info('수정 기능은 아직 구현되지 않았습니다.');
    }
  };

  const title = mode === 'create' ? 'ADD APPLICATION' : 'EDIT APPLICATION';
  const submitText = mode === 'create' ? '추가' : '저장';

  const defaultTrigger = (
    <Button size="sm" className={cn('gap-2')}>
      <Plus className={cn('h-4 w-4')} />
      애플리케이션 추가
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
      <DialogContent className={cn('max-h-[90vh] max-w-lg overflow-y-auto p-0')}>
        <DialogHeader className={cn('border-foreground border-b-2 px-6 py-5')}>
          <DialogTitle className={cn('font-pixel text-[14px] leading-none')}>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6 px-6 py-6')}>
          <div className={cn('space-y-2')}>
            <Label
              htmlFor="applicationName"
              className={cn('text-muted-foreground font-mono text-xs uppercase tracking-widest')}
            >
              애플리케이션 이름
            </Label>
            <Input
              id="applicationName"
              placeholder="애플리케이션 이름 입력"
              className={cn('border-foreground rounded-none font-mono')}
              {...register('applicationName')}
              disabled={isCreatePending}
            />
            <FormErrorMessage error={errors.applicationName} />
          </div>

          <div className={cn('space-y-4')}>
            <div className={cn('flex items-center justify-between')}>
              <Label
                className={cn('text-muted-foreground font-mono text-xs uppercase tracking-widest')}
              >
                권한 범위 (Scopes)
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ applicationScope: '', applicationDescription: '' })}
                className={cn('h-8')}
                disabled={isCreatePending}
              >
                <Plus className={cn('mr-1 h-3 w-3')} />
                Scope 추가
              </Button>
            </div>

            <div className={cn('space-y-4')}>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn('border-foreground relative space-y-2 border-2 p-4 pt-8')}
                >
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className={cn('absolute right-1 top-1 h-6 w-6')}
                      disabled={isCreatePending}
                    >
                      <X className={cn('h-4 w-4')} />
                    </Button>
                  )}

                  <div className={cn('space-y-1')}>
                    <Label className={cn('text-muted-foreground text-[10px] uppercase')}>
                      Scope 이름
                    </Label>
                    <Input
                      placeholder="예: user.read"
                      className={cn('border-foreground rounded-none font-mono text-sm')}
                      {...register(`applicationScopes.${index}.applicationScope` as const)}
                      disabled={isCreatePending}
                    />
                    <FormErrorMessage error={errors.applicationScopes?.[index]?.applicationScope} />
                  </div>

                  <div className={cn('space-y-1')}>
                    <Label className={cn('text-muted-foreground text-[10px] uppercase')}>
                      Scope 설명
                    </Label>
                    <Input
                      placeholder="권한에 대한 설명 입력"
                      className={cn('border-foreground rounded-none font-mono text-sm')}
                      {...register(`applicationScopes.${index}.applicationDescription` as const)}
                      disabled={isCreatePending}
                    />
                    <FormErrorMessage
                      error={errors.applicationScopes?.[index]?.applicationDescription}
                    />
                  </div>
                </div>
              ))}
              {errors.applicationScopes?.root && (
                <FormErrorMessage error={errors.applicationScopes.root} />
              )}
            </div>
          </div>

          <div className={cn('flex justify-end pt-2')}>
            <Button type="submit" disabled={isCreatePending}>
              {isCreatePending ? '처리 중...' : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationFormDialog;
