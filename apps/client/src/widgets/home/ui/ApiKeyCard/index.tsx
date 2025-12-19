'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { authQueryKeys } from '@repo/shared/api';
import { Button, Card, Checkbox, FormErrorMessage, Input } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ApiKeyResponse, CreateApiKeySchema, CreateApiKeyType } from '@/entities/home';
import {
  useCreateApiKey,
  useGetApiKey,
  useGetAvailableScope,
  useUpdateApiKey,
} from '@/widgets/home';

interface ApiKeyCardProps {
  initialApiKeyData?: ApiKeyResponse;
}

const COPIED_STATE_DURATION_MS = 2000;

const ApiKeyCard = ({ initialApiKeyData }: ApiKeyCardProps) => {
  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();

  const userRole = 'USER';

  const { data: availableKeyScope, isLoading: isLoadingKeyScope } = useGetAvailableScope(userRole);

  const { data: apiKeyData, isLoading: isLoadingApiKey } = useGetApiKey({
    initialData: initialApiKeyData,
  });

  const { isPending: isCreatingApiKey, mutate: createApiKey } = useCreateApiKey({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.getApiKey() });
      toast.success('API Key가 생성되었습니다.');
    },
    onError: () => {
      toast.error('API Key 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });

  // const { data: apiKeyRenewableData } = useGetApiKeyRenewable({
  //   initialData: initialApiKeyRenewableData,
  // });

  const { isPending: isUpdatingApiKey, mutate: updateApiKey } = useUpdateApiKey({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.getApiKey() });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.getApiKeyRenewable() });
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
    formState: { errors },
  } = useForm<CreateApiKeyType>({
    resolver: zodResolver(CreateApiKeySchema),
    defaultValues: {
      scopes: apiKeyData?.data?.scopes || [],
      description: apiKeyData?.data?.description || '',
    },
  });

  const buttonText = isCreatingApiKey
    ? 'API 키 생성 중...'
    : apiKeyData?.data?.apiKey
      ? 'API 키 갱신하기'
      : isUpdatingApiKey
        ? 'API 키 갱신 중...'
        : 'API 키 생성하기';

  const handleRenew = () => {
    // const renewable = apiKeyRenewableData?.data?.renewable;
    // if (!renewable) {
    //   toast.error('아직 API Key를 갱신할 수 없습니다.');
    //   return;
    // }
    updateApiKey();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKeyData?.data?.apiKey || '');
    setCopied(true);
    toast.success('복사되었습니다.');
    setTimeout(() => setCopied(false), COPIED_STATE_DURATION_MS);
  };

  const handleScopeToggle = (scopeId: string) => {
    const currentScopes = watch('scopes');

    // 전체 scope 선택했을때 : ex) student:*
    if (scopeId.endsWith(':*')) {
      const [prefix] = scopeId.split(':');
      const availableScopes = availableKeyScope?.data?.data;
      const relatedScopeIds = availableScopes!.flatMap((category) =>
        category.scopes
          .map((scope) => scope.scope)
          .filter((id) => id.startsWith(`${prefix}:`) && !id.endsWith(':*')),
      );

      const allSelected = relatedScopeIds.every((id) => currentScopes.includes(id));
      const nextSelected = allSelected
        ? currentScopes.filter((id) => !relatedScopeIds.includes(id))
        : Array.from(new Set([...currentScopes, ...relatedScopeIds]));

      setValue('scopes', nextSelected, { shouldValidate: true });
      return;
    }

    // 일반 scope 단일 토글
    const isSelected = currentScopes.includes(scopeId);
    const nextSelected = isSelected
      ? currentScopes.filter((id) => id !== scopeId)
      : [...currentScopes, scopeId];

    setValue('scopes', nextSelected, { shouldValidate: true });
  };

  const getIndentation = (level: string) => {
    if (level.includes(':*')) return 'pl-0';
    return 'pl-6';
  };

  const isScopeChecked = (scopeId: string) => {
    const currentScopes = watch('scopes');

    // 젅체 scope를 선택시 끝나는 scope의 경우, 하위 모든 scope가 선택되어 있는지 확인
    if (scopeId.endsWith(':*')) {
      const [prefix] = scopeId.split(':');
      const availableScopes = availableKeyScope?.data?.data ?? [];
      const relatedScopeIds = availableScopes.flatMap((category) =>
        category.scopes
          .map((scope) => scope.scope)
          .filter((id) => id.startsWith(`${prefix}:`) && !id.endsWith(':*')),
      );

      if (relatedScopeIds.length === 0) return false;

      return relatedScopeIds.every((id) => currentScopes.includes(id));
    }

    return currentScopes.includes(scopeId);
  };

  const onSubmit = (data: CreateApiKeyType) => {
    if (apiKeyData?.data?.apiKey) {
      handleRenew();
    }
    createApiKey({ scopes: data.scopes, description: data.description });
  };

  if (isLoadingApiKey || isLoadingKeyScope) {
    return (
      <Card className={cn('p-6')}>
        <div className={cn('text-gray-500')}>API Key를 불러오는 중...</div>
      </Card>
    );
  }

  if (isLoadingKeyScope) {
    return (
      <Card className={cn('p-6')}>
        <div className={cn('text-gray-500')}>API key 범위를 불러오는 중...</div>
      </Card>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6')}>
      {/** api key 발급/갱신 scope 설정 */}
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
              {availableKeyScope?.data?.data.map((category) => {
                const isScopeOnlyOne = category.scopes.length > 1;
                return (
                  <div key={category.title}>
                    <h3 className={cn('mb-2 text-sm font-semibold')}>{category.title}</h3>
                    <div className={cn('space-y-2')}>
                      {category.scopes.map((scope) => (
                        <div
                          key={scope.scope}
                          className={cn(
                            'flex items-start gap-3',
                            isScopeOnlyOne && getIndentation(scope.scope),
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
            <Input placeholder="API의 사용처를 작성해주세요" {...register('description')} />
            <FormErrorMessage
              error={Array.isArray(errors.scopes) ? errors.scopes[0] : errors.scopes}
            />
            <FormErrorMessage error={errors.description} />
            <Button disabled={isCreatingApiKey || isUpdatingApiKey} size="lg" type="submit">
              {buttonText}
            </Button>
          </div>
        </form>
      </Card>

      {/** 현재발급한 api key 조회 */}
      {apiKeyData?.data?.apiKey && (
        <Card className={cn('p-6')}>
          <div className="mb-4">
            <p className="text-muted-foreground mb-2 text-sm">현재 발급된 API 키의 권한:</p>
            <div className="flex flex-wrap gap-2">
              {initialApiKeyData?.data.scopes.map((scope) => (
                <p key={scope} className="bg-primary/10 text-primary rounded px-2 py-1 text-xs">
                  {scope}
                </p>
              ))}
            </div>
          </div>

          <div className={cn('flex items-center justify-between gap-4')}>
            <div className={cn('min-w-0 flex-1')}>
              <code className={cn('break-all font-mono text-sm')}>{apiKeyData?.data?.apiKey}</code>
            </div>
            <div className={cn('flex gap-2')}>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                disabled={copied}
                className={cn('disabled:opacity-100')}
              >
                {copied ? (
                  <Check className={cn('h-4 w-4 text-green-600')} />
                ) : (
                  <Copy className={cn('h-4 w-4')} />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApiKeyCard;
