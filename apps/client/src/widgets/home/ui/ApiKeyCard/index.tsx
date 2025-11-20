'use client';

import { useState } from 'react';

import { authQueryKeys } from '@repo/shared/api';
import { cn } from '@repo/shared/lib';
import { Button, Card } from '@repo/shared/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { ApiKeyRenewableResponse, ApiKeyResponse } from '@/entities/home';
import {
  useCreateApiKey,
  useGetApiKey,
  useGetApiKeyRenewable,
  useUpdateApiKey,
} from '@/widgets/home';

interface ApiKeyCardProps {
  initialApiKeyData?: ApiKeyResponse;
  initialApiKeyRenewableData?: ApiKeyRenewableResponse;
}

const ApiKeyCard = ({ initialApiKeyData, initialApiKeyRenewableData }: ApiKeyCardProps) => {
  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();

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

  const { data: apiKeyRenewableData } = useGetApiKeyRenewable({
    initialData: initialApiKeyRenewableData,
  });

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

  const handleRenew = () => {
    const renewable = apiKeyRenewableData?.data?.renewable;
    if (!renewable) {
      toast.error('아직 API Key를 갱신할 수 없습니다.');
      return;
    }
    updateApiKey();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKeyData?.data?.apiKey || '');
    setCopied(true);
    toast.success('복사되었습니다.');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoadingApiKey) {
    return (
      <Card className={cn('p-6')}>
        <div className={cn('text-gray-500')}>API Key를 불러오는 중...</div>
      </Card>
    );
  }

  if (!apiKeyData?.data?.apiKey) {
    return (
      <Card className={cn('p-6')}>
        <div className={cn('flex flex-col items-center justify-center gap-4')}>
          <div className={cn('text-center')}>
            <p className={cn('mb-2 text-gray-500')}>API Key가 존재하지 않습니다.</p>
            <p className={cn('text-sm text-gray-400')}>
              아래 버튼을 눌러 새로운 API Key를 생성하세요.
            </p>
          </div>
          <Button onClick={() => createApiKey()} disabled={isCreatingApiKey} size="lg">
            {isCreatingApiKey ? 'API Key 생성 중...' : 'API Key 생성하기'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6')}>
      <div className={cn('flex items-center justify-between gap-4')}>
        <div className={cn('min-w-0 flex-1')}>
          <code className={cn('break-all font-mono text-sm')}>{apiKeyData.data.apiKey}</code>
        </div>
        <div className={cn('flex gap-2')}>
          <Button size="icon" variant="outline" onClick={handleRenew}>
            <RefreshCw className={cn(`h-4 w-4 ${isUpdatingApiKey ? 'animate-spin' : ''}`)} />
          </Button>
          <Button size="icon" variant="outline" onClick={handleCopy}>
            {copied ? (
              <Check className={cn('h-4 w-4 text-green-600')} />
            ) : (
              <Copy className={cn('h-4 w-4')} />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyCard;
