'use client';

import { useCopyToClipboard, useGetApiKey } from '@repo/shared/hooks';
import { ApiKeyResponse } from '@repo/shared/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Check, Copy } from 'lucide-react';

interface ApiKeyDisplayProps {
  initialApiKeyData?: ApiKeyResponse;
}


const TerminalDot = () => (
  <div className={cn('h-2.5 w-2.5 border border-background/25 bg-background/15')} />
);

const ApiKeyDisplay = ({ initialApiKeyData }: ApiKeyDisplayProps) => {
  const { copied, copy } = useCopyToClipboard();

  const { data: apiKeyData, isLoading: isLoadingApiKey } = useGetApiKey({
    initialData: initialApiKeyData,
  });

  if (isLoadingApiKey) {
    return (
      <div
        className={cn('w-full border-2 border-foreground pixel-shadow')}
      >
        <div
          className={cn(
            'flex items-center gap-2 border-b-2 border-foreground bg-foreground px-4 py-2',
          )}
        >
          <TerminalDot />
          <TerminalDot />
          <TerminalDot />
          <span
            className={cn('ml-2 text-xs uppercase tracking-widest text-background/70 font-mono')}
          >
            API KEY TERMINAL
          </span>
        </div>
        <div className={cn('p-4')}>
          <span className={cn('text-xs text-muted-foreground font-mono')}>
            {'>'} Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!apiKeyData?.data?.apiKey) return null;

  const isMasked = apiKeyData.data.apiKey.includes('****');
  const EXPIRATION_WARNING_DAYS = 10;
  const isExpiringSoon = apiKeyData.data.expiresInDays <= EXPIRATION_WARNING_DAYS;

  return (
    <div
      className={cn('w-full border-2 border-foreground pixel-shadow')}
    >
      {/* Terminal title bar */}
      <div
        className={cn(
          'flex items-center justify-between border-b-2 border-foreground bg-foreground px-4 py-2',
        )}
      >
        <div className={cn('flex items-center gap-2')}>
          <TerminalDot />
          <TerminalDot />
          <TerminalDot />
          <span
            className={cn('ml-2 text-xs uppercase tracking-widest text-background/80 font-mono')}
          >
            API KEY TERMINAL
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              tabIndex={0}
              className={cn(
                'cursor-default px-2 py-0.5 text-xs font-bold uppercase tracking-wider font-mono',
                isExpiringSoon
                  ? 'bg-destructive text-white'
                  : 'bg-background/20 text-background',
              )}
            >
              D-{apiKeyData.data.expiresInDays}
            </div>
          </TooltipTrigger>
          <TooltipContent>만료일: {apiKeyData.data.expiresAt.split('T')[0]}</TooltipContent>
        </Tooltip>
      </div>

      {/* Body */}
      <div className={cn('space-y-4 p-4')}>
        {/* Scopes */}
        <div>
          <p
            className={cn('mb-2 text-xs uppercase tracking-widest text-muted-foreground font-mono')}
          >
            {'>'} SCOPE
          </p>
          <div className={cn('flex flex-wrap gap-1.5')}>
            {apiKeyData?.data?.scopes.map((scope) => (
              <span
                key={scope}
                className={cn('border border-foreground px-2 py-0.5 text-xs uppercase font-mono')}
              >
                {scope}
              </span>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div>
          <p
            className={cn('mb-2 text-xs uppercase tracking-widest text-muted-foreground font-mono')}
          >
            {'>'} KEY
          </p>
          <div className={cn('flex items-center justify-between gap-3 bg-muted p-3')}>
            <code className={cn('min-w-0 flex-1 break-all text-sm font-mono')}>
              {apiKeyData?.data?.apiKey}
            </code>
            {!isMasked && (
              <button
                onClick={() => copy(apiKeyData.data.apiKey)}
                disabled={copied}
                className={cn(
                  'flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center border border-foreground transition-all hover:bg-foreground hover:text-background disabled:cursor-default disabled:opacity-100',
                )}
              >
                {copied ? (
                  <Check className={cn('h-3.5 w-3.5')} />
                ) : (
                  <Copy className={cn('h-3.5 w-3.5')} />
                )}
              </button>
            )}
          </div>
          {isMasked && (
            <p className={cn('mt-2 text-xs text-muted-foreground font-mono')}>
              // 보안상 마스킹된 키입니다. 갱신 시 전체 키를 확인할 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyDisplay;
