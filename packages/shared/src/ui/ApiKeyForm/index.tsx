'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { authQueryKeys } from '@repo/shared/api';
import {
  useCreateApiKey,
  useGetApiKey,
  useGetAvailableScope,
  useRotateApiKey,
  useScopeSelection,
  useUpdateApiKey,
} from '@repo/shared/hooks';
import {
  ApiKeyFormSchema,
  ApiKeyFormType,
  ApiKeyResponse,
  AvailableScopeListResponse,
  UserRoleType,
} from '@repo/shared/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Checkbox,
  FormErrorMessage,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ApiKeyFormProps {
  initialApiKeyData?: ApiKeyResponse;
  initialAvailableScope?: AvailableScopeListResponse;
  userRole: UserRoleType;
}

const ApiKeyForm = ({ initialApiKeyData, initialAvailableScope, userRole }: ApiKeyFormProps) => {
  const queryClient = useQueryClient();

  const [isRenewConfirmOpen, setIsRenewConfirmOpen] = useState(false);
  const [isExtendConfirmOpen, setIsExtendConfirmOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<ApiKeyFormType | null>(null);

  const { data: availableKeyScope, isLoading: isLoadingKeyScope } = useGetAvailableScope(userRole, {
    initialData: initialAvailableScope,
  });

  const { data: apiKeyData, isLoading: isLoadingApiKey } = useGetApiKey({
    initialData: initialApiKeyData,
  });

  const { isPending: isCreatingApiKey, mutate: createApiKey } = useCreateApiKey({
    onSuccess: (data) => {
      // 마스킹되지 않은 새 키를 캐시에 즉시 설정
      queryClient.setQueryData(authQueryKeys.getApiKey(), data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'api-keys', 'list'] });
      toast.success('API Key가 생성되었습니다.');
    },
    onError: () => {
      toast.error('API Key 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { isPending: isUpdatingApiKey, mutate: updateApiKey } = useUpdateApiKey({
    onSuccess: (data) => {
      // 기본 성공 처리 (필요시)
      queryClient.setQueryData(authQueryKeys.getApiKey(), data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'api-keys', 'list'] });
    },
    onError: () => {
      toast.error('API Key 갱신에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { isPending: isRotatingApiKey, mutate: rotateApiKey } = useRotateApiKey({
    onSuccess: (data) => {
      // 기본 성공 처리 (필요시)
      queryClient.setQueryData(authQueryKeys.getApiKey(), data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'api-keys', 'list'] });
    },
    onError: () => {
      toast.error('API Key 갱신에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<ApiKeyFormType>({
    resolver: zodResolver(ApiKeyFormSchema),
    defaultValues: {
      scopes: [],
      description: '',
    },
  });

  const watchedScopes = watch('scopes');
  const watchedDescription = watch('description');

  const isScopesEqual =
    apiKeyData?.data?.scopes &&
    apiKeyData.data.scopes.length === watchedScopes.length &&
    apiKeyData.data.scopes.every((s) => watchedScopes.includes(s));

  const isDescriptionEqual = apiKeyData?.data?.description === watchedDescription;

  const isApiKeyDataEqual = !!apiKeyData?.data?.apiKey && isScopesEqual && isDescriptionEqual;

  useEffect(() => {
    if (apiKeyData?.data) {
      reset({
        scopes: apiKeyData.data.scopes || [],
        description: apiKeyData.data.description || '',
      });
    }
  }, [apiKeyData, reset]);

  const buttonText = isCreatingApiKey
    ? 'API 키 생성 중...'
    : isUpdatingApiKey || isRotatingApiKey
      ? 'API 키 갱신 중...'
      : apiKeyData?.data?.apiKey
        ? 'API 키 갱신하기'
        : 'API 키 생성하기';

  const buttonTooptipText = !apiKeyData?.data?.apiKey
    ? '새로운 API 키를 발급합니다.'
    : isApiKeyDataEqual
      ? '기존 API 키를 폐기하고 권한 범위와 설명이 같은 새로운 키를 발급합니다.'
      : 'API 키의 권한 범위 및 설명을 수정한 새로운 키를 발급합니다.';

  const { handleScopeToggle, isScopeChecked, getIndentation } = useScopeSelection({
    availableScopes: availableKeyScope,
    watch,
    setValue,
    fieldName: 'scopes',
  });

  const onSubmit = (data: ApiKeyFormType) => {
    if (!apiKeyData?.data?.apiKey) {
      createApiKey(data);
    }
  };

  const onRenewClick = handleSubmit((data) => {
    setPendingFormData(data);
    setIsRenewConfirmOpen(true);
  });

  const onExtendClick = handleSubmit((data) => {
    setPendingFormData(data);
    setIsExtendConfirmOpen(true);
  });

  const onRenewConfirm = () => {
    if (!pendingFormData) return;
    const sharedOptions = {
      onSuccess: (res: ApiKeyResponse) => {
        queryClient.setQueryData(authQueryKeys.getApiKey(), res);
        toast.success('갱신에 성공하였습니다.');
      },
      onSettled: () => setIsRenewConfirmOpen(false),
    };
    if (isApiKeyDataEqual) {
      rotateApiKey(pendingFormData, sharedOptions);
    } else {
      updateApiKey(pendingFormData, sharedOptions);
    }
  };

  const onExtendConfirm = () => {
    if (!pendingFormData) return;
    updateApiKey(pendingFormData, {
      onSuccess: (res: ApiKeyResponse) => {
        queryClient.setQueryData(authQueryKeys.getApiKey(), res);
        toast.success('연장에 성공하였습니다.');
      },
      onSettled: () => setIsExtendConfirmOpen(false),
    });
  };

  const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };

  if (isLoadingApiKey || isLoadingKeyScope) {
    return (
      <div
        className={cn('border-2 border-foreground p-5 pixel-shadow-sm')}
      >
        <span className={cn('text-sm text-muted-foreground font-mono')}>
          {'>'} 권한 범위 불러오는 중...
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn('border-2 border-foreground p-5 pixel-shadow-sm')}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cn('mb-6 flex flex-col gap-4')}>
          <div>
            <p className={cn('mb-1 text-sm font-bold uppercase tracking-wide font-mono')}>
              API 권한 범위 선택
            </p>
            <p className={cn('text-muted-foreground text-xs font-mono')}>
              {'>'} API 키로 접근할 수 있는 권한 범위를 선택하세요.
            </p>
          </div>
          <div className={cn('mb-4 space-y-6')}>
            {availableKeyScope?.data?.list.map((category) => {
              const hasMultipleScopes = category.scopes.length > 1;
              return (
                <div key={category.title}>
                  <h3 className={cn('mb-2 text-sm font-semibold')}>{category.title}</h3>
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
                          id={scope.scope}
                          checked={isScopeChecked(scope.scope)}
                          onCheckedChange={() => handleScopeToggle(scope.scope)}
                        />
                        <div className={cn('flex-1')}>
                          <label
                            htmlFor={scope.scope}
                            className={cn('cursor-pointer text-sm font-medium leading-none')}
                          >
                            {scope.scope}
                          </label>
                          <p className={cn('text-muted-foreground mt-1 text-sm')}>
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
          <Input placeholder="설명을 작성해주세요." {...register('description')} />
          <FormErrorMessage error={errors.description} />
          {apiKeyData?.data?.apiKey && (
            <AlertDialog open={isRenewConfirmOpen} onOpenChange={setIsRenewConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>API 키 갱신</AlertDialogTitle>
                  <AlertDialogDescription>
                    {isApiKeyDataEqual
                      ? '기존 API 키를 폐기하고 새로운 키를 발급합니다. 이 작업은 되돌릴 수 없습니다.'
                      : 'API 키의 권한 범위와 설명을 수정하여 새로운 키를 발급합니다.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={onRenewConfirm}>확인</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className={cn('flex flex-col gap-2')}>
            <Tooltip className="w-full">
              <TooltipTrigger asChild>
                {apiKeyData?.data?.apiKey ? (
                  <button
                    className={cn(
                      'w-full cursor-pointer border-2 border-foreground bg-foreground py-3 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 font-mono',
                    )}
                    disabled={isCreatingApiKey || isUpdatingApiKey || isRotatingApiKey}
                    type="button"
                    onClick={onRenewClick}
                  >
                    {buttonText}
                  </button>
                ) : (
                  <button
                    className={cn(
                      'w-full cursor-pointer border-2 border-foreground bg-foreground py-3 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 font-mono',
                    )}
                    disabled={isCreatingApiKey || isUpdatingApiKey || isRotatingApiKey}
                    type="submit"
                  >
                    {buttonText}
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent>{buttonTooptipText}</TooltipContent>
            </Tooltip>
          </div>
          {isApiKeyDataEqual && (
            <div className={cn('flex flex-col gap-2')}>
              <AlertDialog open={isExtendConfirmOpen} onOpenChange={setIsExtendConfirmOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>기한 연장</AlertDialogTitle>
                    <AlertDialogDescription>
                      API 키의 만료 기한을 연장합니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={onExtendConfirm}>확인</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Tooltip className="w-full">
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'w-full cursor-pointer border-2 border-foreground py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60 font-mono',
                    )}
                    disabled={isCreatingApiKey || isUpdatingApiKey || isRotatingApiKey}
                    type="button"
                    onClick={onExtendClick}
                  >
                    기한 연장하기
                  </button>
                </TooltipTrigger>
                <TooltipContent>API 키의 만료 기한을 연장합니다.</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApiKeyForm;
