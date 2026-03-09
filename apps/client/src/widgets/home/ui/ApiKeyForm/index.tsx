'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { authQueryKeys } from '@repo/shared/api';
import { UserRoleType } from '@repo/shared/types';
import {
  Button,
  Card,
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

import {
  ApiKeyFormSchema,
  ApiKeyFormType,
  ApiKeyResponse,
  AvailableScopeListResponse,
} from '@/entities/home';
import { useScopeSelection } from '@/shared/hooks';
import {
  useCreateApiKey,
  useGetApiKey,
  useGetAvailableScope,
  useRotateApiKey,
  useUpdateApiKey,
} from '@/widgets/home';

interface ApiKeyFormProps {
  initialApiKeyData?: ApiKeyResponse;
  initialAvailableScope?: AvailableScopeListResponse;
  userRole: UserRoleType;
}

const ApiKeyForm = ({ initialApiKeyData, initialAvailableScope, userRole }: ApiKeyFormProps) => {
  const queryClient = useQueryClient();

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
    },
    onError: () => {
      toast.error('API Key 갱신에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { isPending: isRotatingApiKey, mutate: rotateApiKey } = useRotateApiKey({
    onSuccess: (data) => {
      // 기본 성공 처리 (필요시)
      queryClient.setQueryData(authQueryKeys.getApiKey(), data);
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
      return;
    }

    if (isApiKeyDataEqual) {
      rotateApiKey(data, {
        onSuccess: (res) => {
          queryClient.setQueryData(authQueryKeys.getApiKey(), res);
          toast.success('갱신에 성공하였습니다.');
        },
      });
      return;
    }

    updateApiKey(data, {
      onSuccess: (res) => {
        queryClient.setQueryData(authQueryKeys.getApiKey(), res);
        toast.success('갱신에 성공하였습니다.');
      },
    });
  };

  if (isLoadingApiKey || isLoadingKeyScope) {
    return (
      <Card className={cn('p-6')}>
        <div className={cn('text-muted-foreground text-sm')}>권한 범위를 불러오는 중...</div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cn('mb-6 flex flex-col gap-4')}>
          <div>
            <p className={cn('mb-2 text-lg font-extrabold')}>API 권한 범위 선택</p>
            <p className={cn('text-muted-foreground text-sm')}>
              API 키로 접근할 수 있는 권한 범위를 선택하세요. 여러 개를 선택할 수 있습니다.
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
          <div className={cn('flex flex-col gap-2')}>
            <Tooltip className="w-full">
              <TooltipTrigger asChild>
                <Button
                  className="w-full"
                  disabled={isCreatingApiKey || isUpdatingApiKey || isRotatingApiKey}
                  size="lg"
                  type="submit"
                >
                  {buttonText}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{buttonTooptipText}</TooltipContent>
            </Tooltip>
          </div>
          {isApiKeyDataEqual && (
            <div className={cn('flex flex-col gap-2')}>
              <Tooltip className="w-full">
                <TooltipTrigger asChild>
                  <Button
                    className="w-full"
                    disabled={isCreatingApiKey || isUpdatingApiKey || isRotatingApiKey}
                    size="lg"
                    type="button"
                    variant="outline"
                    onClick={handleSubmit((data) =>
                      updateApiKey(data, {
                        onSuccess: (res) => {
                          queryClient.setQueryData(authQueryKeys.getApiKey(), res);
                          toast.success('연장에 성공하였습니다.');
                        },
                      }),
                    )}
                  >
                    기한 연장하기
                  </Button>
                </TooltipTrigger>
                <TooltipContent>API 키의 만료 기한을 연장합니다.</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </form>
    </Card>
  );
};

export default ApiKeyForm;
