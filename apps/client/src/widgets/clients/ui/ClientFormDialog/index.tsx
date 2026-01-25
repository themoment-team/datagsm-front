'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
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
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Plus, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Client, ClientFormSchema, ClientFormType, CreateClientData } from '@/entities/clients';
import { useScopeSelection } from '@/shared/hooks';
import { useCreateClient, useGetAvailableScopes, useUpdateClient } from '@/widgets/clients';

interface ClientFormDialogProps {
  mode: 'create' | 'edit';
  client?: Client;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreateSuccess?: (data: CreateClientData) => void;
}

const ClientFormDialog = ({
  mode,
  client,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onCreateSuccess,
}: ClientFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const queryClient = useQueryClient();

  const { data: availableScopes, isLoading: isLoadingScopes } = useGetAvailableScopes();

  const { isPending: isCreating, mutate: createClient } = useCreateClient({
    onSuccess: (data) => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('클라이언트가 생성되었습니다.');
      onCreateSuccess?.(data.data);
    },
    onError: () => {
      toast.error('클라이언트 생성에 실패했습니다.');
    },
  });

  const { isPending: isUpdating, mutate: updateClient } = useUpdateClient({
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('클라이언트 정보가 수정되었습니다.');
    },
    onError: () => {
      toast.error('클라이언트 정보 수정에 실패했습니다.');
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClientFormType>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      name: '',
      redirectUrls: [''],
      scopes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'redirectUrls' as never,
  });

  const { handleScopeToggle, isScopeChecked, getIndentation } = useScopeSelection({
    availableScopes,
    watch,
    setValue,
    fieldName: 'scopes',
  });

  useEffect(() => {
    if (mode === 'edit' && client && open) {
      reset({
        name: client.name,
        redirectUrls: [...client.redirectUrl],
        scopes: [...client.scopes],
      });
    } else if (mode === 'create' && open) {
      reset({
        name: '',
        redirectUrls: [''],
        scopes: [],
      });
    }
  }, [mode, client, open, reset]);

  const onSubmit = (data: ClientFormType) => {
    if (mode === 'create') {
      createClient(data);
    } else if (mode === 'edit' && client) {
      const { name, redirectUrls } = data;
      updateClient({
        clientId: client.id,
        data: { name, redirectUrls },
      });
    }
  };

  const isPending = isCreating || isUpdating;
  const title = mode === 'create' ? '클라이언트 추가' : '클라이언트 수정';
  const submitText = mode === 'create' ? '추가' : '저장';

  const defaultTrigger =
    mode === 'create' ? (
      <Button size="sm" className={cn('gap-2')} disabled={isLoadingScopes}>
        {isLoadingScopes ? (
          <Loader2 className={cn('h-4 w-4 animate-spin')} />
        ) : (
          <Plus className={cn('h-4 w-4')} />
        )}
        클라이언트 추가
      </Button>
    ) : (
      <Button variant="ghost" size="icon" disabled={isLoadingScopes}>
        {isLoadingScopes ? (
          <Loader2 className={cn('h-4 w-4 animate-spin')} />
        ) : (
          <Pencil className={cn('h-4 w-4')} />
        )}
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
      <DialogContent className={cn('max-h-[90vh] max-w-lg overflow-y-auto')}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4 py-4')}>
          <div className={cn('space-y-2')}>
            <Label htmlFor="name">클라이언트 이름</Label>
            <Input id="name" placeholder="클라이언트 이름 입력" {...register('name')} />
            <FormErrorMessage error={errors.name} />
          </div>

          {mode === 'edit' && client && (
            <div className={cn('space-y-2')}>
              <Label>클라이언트 ID</Label>
              <code
                className={cn(
                  'bg-muted text-muted-foreground block rounded px-3 py-2 font-mono text-sm',
                )}
              >
                {client.id}
              </code>
            </div>
          )}

          <div className={cn('space-y-2')}>
            <div className={cn('flex items-center justify-between')}>
              <Label>리다이렉트 URL</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append('')}
                className={cn('h-8')}
              >
                <Plus className={cn('mr-1 h-3 w-3')} />
                URL 추가
              </Button>
            </div>
            <div className={cn('space-y-2')}>
              {fields.map((field, index) => (
                <div key={field.id} className={cn('flex flex-col gap-1')}>
                  <div className={cn('flex items-center gap-2')}>
                    <Input
                      placeholder="https://example.com/callback"
                      {...register(`redirectUrls.${index}` as const)}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <X className={cn('h-4 w-4')} />
                      </Button>
                    )}
                  </div>
                  <FormErrorMessage error={errors.redirectUrls?.[index]} />
                </div>
              ))}
              {errors.redirectUrls?.root && <FormErrorMessage error={errors.redirectUrls.root} />}
            </div>
          </div>

          {mode === 'create' && (
            <div className={cn('space-y-2')}>
              <Label>권한 (Scopes)</Label>
              <p className={cn('text-muted-foreground text-xs')}>
                클라이언트가 접근할 수 있는 권한을 선택하세요.
              </p>
              <div className={cn('mt-2 space-y-4 rounded-md border p-4')}>
                {availableScopes?.data?.list.map((category) => {
                  const hasMultipleScopes = category.scopes.length > 1;
                  return (
                    <div key={category.title}>
                      <h4 className={cn('text-muted-foreground mb-2 text-xs font-semibold')}>
                        {category.title}
                      </h4>
                      <div className={cn('space-y-2')}>
                        {category.scopes.map((scope) => (
                          <div
                            key={scope.scope}
                            className={cn(
                              'flex items-start gap-3',
                              hasMultipleScopes && getIndentation(scope.scope),
                            )}
                          >
                            <Checkbox
                              id={`${mode}-${scope.scope}`}
                              checked={isScopeChecked(scope.scope)}
                              onCheckedChange={() => handleScopeToggle(scope.scope)}
                            />
                            <div className={cn('flex-1')}>
                              <label
                                htmlFor={`${mode}-${scope.scope}`}
                                className={cn('cursor-pointer text-sm font-medium leading-none')}
                              >
                                {scope.scope}
                              </label>
                              <p className={cn('text-muted-foreground mt-0.5 text-xs')}>
                                {scope.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <FormErrorMessage
                error={Array.isArray(errors.scopes) ? errors.scopes[0] : errors.scopes}
              />
            </div>
          )}

          <div className={cn('flex justify-end pt-4')}>
            <Button type="submit" disabled={isPending}>
              {submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
