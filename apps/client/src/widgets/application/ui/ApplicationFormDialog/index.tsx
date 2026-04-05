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
import {
  useCreateApplication,
  useCreateApplicationScope,
  useDeleteApplicationScope,
  useUpdateApplicationName,
  useUpdateApplicationScope,
} from '@/widgets/application';

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

  const { mutate: createApplication, isPending: isCreatePending } = useCreateApplication({
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
  });

  const { mutateAsync: updateApplicationName } = useUpdateApplicationName();
  const { mutateAsync: updateApplicationScope } = useUpdateApplicationScope();
  const { mutateAsync: deleteApplicationScope } = useDeleteApplicationScope();
  const { mutateAsync: createApplicationScope } = useCreateApplicationScope();

  const [isUpdatePending, setIsUpdatePending] = useState(false);

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

  const onSubmit = async (data: ApplicationFormType) => {
    if (mode === 'create') {
      createApplication({
        name: data.applicationName,
        scopes: data.applicationScopes.map((scope) => ({
          scopeName: scope.applicationScope,
          description: scope.applicationDescription,
        })),
      });
    } else if (mode === 'edit' && application) {
      setIsUpdatePending(true);
      try {
        const promises: Promise<any>[] = [];

        // 이름 수정 확인
        if (data.applicationName !== application.applicationName) {
          promises.push(
            updateApplicationName({
              id: application.id,
              data: { name: data.applicationName },
            }),
          );
        }

        // Scope 수정, 삭제, 추가 확인
        // 삭제된 Scope 찾기
        const currentScopeIds = data.applicationScopes
          .map((s) => s.id)
          .filter((id): id is number => id !== undefined);

        const deletedScopes = application.applicationScopes.filter(
          (original) => original.id !== undefined && !currentScopeIds.includes(original.id),
        );

        for (const scope of deletedScopes) {
          promises.push(
            deleteApplicationScope({
              applicationId: application.id,
              scopeId: scope.id!,
            }),
          );
        }

        // 수정 또는 추가된 Scope 확인
        for (const scope of data.applicationScopes) {
          if (scope.id) {
            // 수정
            const original = application.applicationScopes.find((s) => s.id === scope.id);
            if (
              original &&
              (original.applicationScope !== scope.applicationScope ||
                original.applicationDescription !== scope.applicationDescription)
            ) {
              promises.push(
                updateApplicationScope({
                  applicationId: application.id,
                  scopeId: scope.id,
                  data: {
                    scopeName: scope.applicationScope,
                    description: scope.applicationDescription,
                  },
                }),
              );
            }
          } else {
            // 추가 (id가 없는 경우)
            promises.push(
              createApplicationScope({
                applicationId: application.id,
                data: {
                  scopeName: scope.applicationScope,
                  description: scope.applicationDescription,
                },
              }),
            );
          }
        }

        if (promises.length > 0) {
          await Promise.all(promises);
          queryClient.invalidateQueries({
            queryKey: ['applications', 'list'],
          });
          toast.success('애플리케이션이 수정되었습니다.');
        } else {
          toast.info('변경사항이 없습니다.');
        }

        setOpen(false);
      } catch (error) {
        toast.error('애플리케이션 수정 중 오류가 발생했습니다.');
      } finally {
        setIsUpdatePending(false);
      }
    }
  };

  const title = mode === 'create' ? 'ADD APPLICATION' : 'EDIT APPLICATION';
  const submitText = mode === 'create' ? '추가' : '저장';
  const isPending = isCreatePending || isUpdatePending;

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
              disabled={isPending}
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
                disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
            <Button type="submit" disabled={isPending}>
              {isPending ? '처리 중...' : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationFormDialog;
