'use client';

import { useCopyToClipboard } from '@repo/shared/hooks';
import { Button, Card } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Check, Copy } from 'lucide-react';

import { ApiKeyResponse } from '@/entities/home';

import { useGetApiKey } from '../../model/useGetApiKey';

interface ApiKeyDisplayProps {
  initialApiKeyData?: ApiKeyResponse;
}

const ApiKeyDisplay = ({ initialApiKeyData }: ApiKeyDisplayProps) => {
  const { copied, copy } = useCopyToClipboard();

  const { data: apiKeyData, isLoading: isLoadingApiKey } = useGetApiKey({
    initialData: initialApiKeyData,
  });

  if (isLoadingApiKey) {
    return (
      <Card className={cn('p-6')}>
        <div className="text-muted-foreground text-sm">API 키를 불러오는 중...</div>
      </Card>
    );
  }

  if (!apiKeyData?.data?.apiKey) return null;

  const isMasked = apiKeyData.data.apiKey.includes('****');

  return (
    <Card className={cn('p-6')}>
      <div className="mb-4">
        <p className="text-muted-foreground mb-2 text-sm">현재 발급된 API 키의 권한:</p>
        <div className="flex flex-wrap gap-2">
          {apiKeyData?.data?.scopes.map((scope) => (
            <p key={scope} className="bg-primary/10 text-primary rounded px-2 py-1 text-xs">
              {scope}
            </p>
          ))}
        </div>
      </div>

      <div className={cn('flex flex-col gap-2')}>
        <div className={cn('flex items-center justify-between gap-4')}>
          <div className={cn('min-w-0 flex-1')}>
            <code className={cn('break-all font-mono text-sm')}>{apiKeyData?.data?.apiKey}</code>
          </div>
          {!isMasked && (
            <div className={cn('flex gap-2')}>
              <Button
                size="icon"
                variant="outline"
                onClick={() => copy(apiKeyData.data.apiKey)}
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
          )}
        </div>
        {isMasked && (
          <p className="text-muted-foreground text-xs">
            보안을 위해 마스킹된 키입니다. 키를 갱신하면 전체 키를 확인할 수 있습니다.
          </p>
        )}
      </div>
    </Card>
  );
};

export default ApiKeyDisplay;
