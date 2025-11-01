'use client';

import { useEffect, useState } from 'react';

import { authQueryKeys } from '@repo/shared/api';
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
  const [hasCreateFailed, setHasCreateFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();

  const { data: apiKeyData, isLoading: isLoadingApiKey } = useGetApiKey({
    initialData: initialApiKeyData,
  });

  const { isPending: isCreatingApiKey, mutate: createApiKey } = useCreateApiKey({
    onSuccess: () => {
      setHasCreateFailed(false);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.getApiKey() });
    },
    onError: () => {
      setHasCreateFailed(true);
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

  useEffect(() => {
    if (!isLoadingApiKey && !apiKeyData?.data?.apiKey && !isCreatingApiKey && !hasCreateFailed) {
      createApiKey();
    }
  }, [isLoadingApiKey, apiKeyData?.data?.apiKey, isCreatingApiKey, hasCreateFailed, createApiKey]);

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
      <Card className="p-6">
        <div className="text-gray-500">API Key를 불러오는 중...</div>
      </Card>
    );
  }

  if (!apiKeyData?.data?.apiKey) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-gray-500">
              {isCreatingApiKey
                ? 'API Key를 생성하는 중...'
                : hasCreateFailed
                  ? 'API Key 생성에 실패했습니다.'
                  : 'API Key가 없습니다.'}
            </div>
          </div>
          {hasCreateFailed && (
            <Button
              onClick={() => {
                setHasCreateFailed(false);
                createApiKey();
              }}
              disabled={isCreatingApiKey}
              variant="outline"
            >
              다시 시도
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <code className="break-all font-mono text-sm">{apiKeyData.data.apiKey}</code>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={handleRenew}>
            <RefreshCw className={`h-4 w-4 ${isUpdatingApiKey ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="icon" variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyCard;
