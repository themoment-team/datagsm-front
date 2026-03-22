'use client';

import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useScopeSelection } from '@repo/shared/hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const pendingFormData = useRef<ClientFormType | null>(null);
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
      toast.success('클라이언트 데이터가 수정되었습니다.');
    },
    onError: () => {
      toast.error('클라이언트 데이터 수정에 실패했습니다.');
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
      clientName: '',
      serviceName: '',
      redirectUrls: [{ url: '' }],
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
    if (!open) return;

    if (mode === 'edit' && client) {
      reset({
        clientName: client.clientName,
        serviceName: client.serviceName,
        redirectUrls: client.redirectUrl.map((url) => ({ url })),
        scopes: [...client.scopes],
      });
    } else if (mode === 'create') {
      reset({
        clientName: '',
        serviceName: '',
        redirectUrls: [{ url: '' }],
        scopes: [],
      });
    }
  }, [mode, client, open, reset]);

  const onSubmit = (data: ClientFormType) => {
    const redirectUrls = data.redirectUrls.map((item) => item.url);

    if (mode === 'create') {
      createClient({
        ...data,
        redirectUrls,
      });
    }
  };

  const onSaveClick = handleSubmit((data) => {
    pendingFormData.current = data;
    setIsConfirmOpen(true);
  });

  const onConfirmSave = () => {
    const data = pendingFormData.current;
    if (!data || !client) return;
    const redirectUrls = data.redirectUrls.map((item) => item.url);
    updateClient(
      {
        clientId: client.id,
        data: {
          clientName: data.clientName,
          serviceName: data.serviceName,
          redirectUrls,
        },
      },
      { onSettled: () => setIsConfirmOpen(false) },
    );
  };

  const isPending = isCreating || isUpdating;
  const title = mode === 'create' ? 'ADD CLIENT' : 'EDIT CLIENT';
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
      <DialogContent
        className={cn('max-h-[90vh] max-w-lg overflow-y-auto rounded-none border-2 border-foreground pixel-shadow p-0')}
      >
        <DialogHeader className={cn('border-b-2 border-foreground px-6 py-5')}>
          <DialogTitle className={cn('font-pixel text-[14px] leading-none')}>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6 px-6 py-6')}>
          <div className={cn('space-y-2')}>
            <Label htmlFor="clientName" className={cn('font-mono text-xs uppercase tracking-widest text-muted-foreground')}>클라이언트 이름</Label>
            <Input
              id="clientName"
              placeholder="클라이언트 이름 입력"
              className={cn('border-foreground rounded-none font-mono focus-visible:ring-0')}
              {...register('clientName')}
            />
            <FormErrorMessage error={errors.clientName} />
          </div>

          <div className={cn('space-y-2')}>
            <Label htmlFor="serviceName" className={cn('font-mono text-xs uppercase tracking-widest text-muted-foreground')}>서비스 명칭</Label>
            <Input
              id="serviceName"
              placeholder="로그인 페이지에 노출될 서비스 명칭 입력"
              className={cn('border-foreground rounded-none font-mono focus-visible:ring-0')}
              {...register('serviceName')}
            />
            <FormErrorMessage error={errors.serviceName} />
          </div>

          {mode === 'edit' && client && (
            <div className={cn('space-y-2')}>
              <Label className={cn('font-mono text-xs uppercase tracking-widest text-muted-foreground')}>클라이언트 ID</Label>
              <code
                className={cn(
                  'bg-muted text-muted-foreground block rounded-none border border-foreground/30 px-3 py-2 font-mono text-sm',
                )}
              >
                {client.id}
              </code>
            </div>
          )}

          <div className={cn('space-y-2')}>
            <div className={cn('flex items-center justify-between')}>
              <Label className={cn('font-mono text-xs uppercase tracking-widest text-muted-foreground')}>리다이렉트 URL</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ url: '' })}
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
                      className={cn('border-foreground rounded-none font-mono focus-visible:ring-0')}
                      {...register(`redirectUrls.${index}.url` as const)}
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
                  <FormErrorMessage error={errors.redirectUrls?.[index]?.url} />
                </div>
              ))}
              {errors.redirectUrls?.root && <FormErrorMessage error={errors.redirectUrls.root} />}
            </div>
          </div>

          {mode === 'create' && (
            <div className={cn('space-y-2')}>
              <Label className={cn('font-mono text-xs uppercase tracking-widest text-muted-foreground')}>권한 범위</Label>
              <p className={cn('text-muted-foreground text-xs')}>
                클라이언트가 접근할 수 있는 권한 범위를 선택하세요.
              </p>
              <div className={cn('mt-2 space-y-4 rounded-none border-2 border-foreground p-4')}>
                {availableScopes?.data?.list.map((category) => {
                  const hasMultipleScopes = category.scopes.length > 1;
                  return (
                    <div key={category.title}>
                      <h4 className={cn('text-muted-foreground mb-2 font-mono text-xs font-semibold uppercase tracking-widest')}>
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
                                className={cn('cursor-pointer font-mono text-xs leading-none')}
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

          <div className={cn('flex justify-end pt-2')}>
            {mode === 'edit' ? (
              <>
                <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                  <AlertDialogContent className={cn('border-foreground')}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>클라이언트 수정</AlertDialogTitle>
                      <AlertDialogDescription>
                        정말로 &apos;{client?.clientName}&apos; 클라이언트 정보를 수정하시겠습니까?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={onConfirmSave}>저장</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button type="button" disabled={isPending} onClick={onSaveClick}>
                  저장
                </Button>
              </>
            ) : (
              <Button type="submit" disabled={isPending}>
                {submitText}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
