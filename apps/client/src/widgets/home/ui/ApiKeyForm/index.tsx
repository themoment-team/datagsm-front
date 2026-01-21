'use client';

import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { authQueryKeys } from '@repo/shared/api';
import { UserRoleType } from '@repo/shared/types';
import { Button, Card, Checkbox, FormErrorMessage, Input } from '@repo/shared/ui';
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
import {
  useCreateApiKey,
  useGetApiKey,
  useGetAvailableScope,
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
      // 마스킹되지 않은 갱신된 키를 캐시에 즉시 설정
      queryClient.setQueryData(authQueryKeys.getApiKey(), data);
      toast.success('API Key가 갱신되었습니다.');
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
    : isUpdatingApiKey
      ? 'API 키 갱신 중...'
      : apiKeyData?.data?.apiKey
        ? 'API 키 갱신하기'
        : 'API 키 생성하기';

  const scopeMap = useMemo(() => {
    const map = new Map<string, string[]>();

    const categories = availableKeyScope?.data?.list || [];
    categories.forEach((category) => {
      category.scopes.forEach(({ scope }) => {
        if (scope.endsWith(':*')) return;

        const prefix = scope.split(':')[0];
        map.set(prefix!, [...(map.get(prefix!) ?? []), scope]);
      });
    });

    return map;
  }, [availableKeyScope]);

  const handleScopeToggle = (scope: string) => {
    const currentScopes = watch('scopes');

    // 전체 scope 선택
    if (scope.endsWith(':*')) {
      const prefix = scope.split(':')[0];
      const relatedScopes = scopeMap.get(prefix!) ?? [];

      const allSelected =
        relatedScopes.length > 0 && relatedScopes.every((id) => currentScopes.includes(id));

      const nextSelected = allSelected
        ? currentScopes.filter((id) => !relatedScopes.includes(id))
        : Array.from(new Set([...currentScopes, ...relatedScopes]));

      setValue('scopes', nextSelected, { shouldValidate: true });
      return;
    }

    // 일반 scope 단일 토글
    setValue(
      'scopes',
      currentScopes.includes(scope)
        ? currentScopes.filter((id) => id !== scope)
        : [...currentScopes, scope],
      { shouldValidate: true },
    );
  };

  const isScopeChecked = (scope: string) => {
    const currentScopes = watch('scopes');

    // 전체 scope일 경우 하위 scope 탐색
    if (scope.endsWith(':*')) {
      const prefix = scope.split(':')[0];
      const relatedScopes = scopeMap.get(prefix!) ?? [];

      return relatedScopes.length > 0 && relatedScopes.every((id) => currentScopes.includes(id));
    }

    return currentScopes.includes(scope);
  };

  const getIndentation = (level: string) => {
    if (level.includes(':*')) return 'pl-0';
    return 'pl-6';
  };

  const onSubmit = ({ scopes, description }: ApiKeyFormType) => {
    const data = { scopes, description };

    if (apiKeyData?.data?.apiKey) {
      updateApiKey(data);
    } else {
      createApiKey(data);
    }
  };

  if (isLoadingApiKey || isLoadingKeyScope) {
    return (
      <Card className={cn('p-6')}>
        <div className={cn('text-muted-foreground text-sm')}>권한 정보를 불러오는 중...</div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={cn('mb-6 flex flex-col gap-4')}>
          <div>
            <p className={cn('mb-2 text-lg font-extrabold')}>API 권한 선택</p>
            <p className={cn('text-muted-foreground text-sm')}>
              API 키로 접근할 수 있는 권한을 선택하세요. 여러 개를 선택할 수 있습니다.
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
          <Button disabled={isCreatingApiKey || isUpdatingApiKey} size="lg" type="submit">
            {buttonText}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ApiKeyForm;
