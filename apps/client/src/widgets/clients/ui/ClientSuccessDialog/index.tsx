'use client';

import { useState } from 'react';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Label } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { AlertTriangle, Check, Copy } from 'lucide-react';

import { CreatedClient } from '@/entities/clients';

interface ClientSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: CreatedClient | null;
}

const ClientSuccessDialog = ({ open, onOpenChange, client }: ClientSuccessDialogProps) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const handleCopyClientId = (clientId: string) => {
    navigator.clipboard.writeText(clientId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-md')}>
        <DialogHeader>
          <DialogTitle className={cn('flex items-center gap-2')}>
            <Check className={cn('h-5 w-5 text-green-500')} />
            클라이언트 생성 완료
          </DialogTitle>
        </DialogHeader>
        <div className={cn('space-y-4 py-4')}>
          <div
            className={cn(
              'rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950',
            )}
          >
            <div className={cn('flex gap-3')}>
              <AlertTriangle
                className={cn('mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400')}
              />
              <div className={cn('text-sm text-amber-800 dark:text-amber-200')}>
                <p className={cn('font-semibold')}>중요: 클라이언트 시크릿을 안전하게 저장하세요</p>
                <p className={cn('mt-1 text-amber-700 dark:text-amber-300')}>
                  클라이언트 시크릿은 이 창을 닫으면 다시 확인할 수 없습니다. 반드시 복사하여 안전한
                  곳에 보관하세요.
                </p>
              </div>
            </div>
          </div>

          <div className={cn('space-y-3')}>
            <div className={cn('space-y-1.5')}>
              <Label className={cn('text-muted-foreground text-xs')}>클라이언트 이름</Label>
              <p className={cn('font-medium')}>{client.name}</p>
            </div>

            <div className={cn('space-y-1.5')}>
              <Label className={cn('text-muted-foreground text-xs')}>클라이언트 ID</Label>
              <div className={cn('flex items-center gap-2')}>
                <code
                  className={cn('bg-muted flex-1 break-all rounded px-3 py-2 font-mono text-sm')}
                >
                  {client.clientId}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyClientId(client.clientId)}
                >
                  {copiedId ? (
                    <Check className={cn('h-4 w-4 text-green-500')} />
                  ) : (
                    <Copy className={cn('h-4 w-4')} />
                  )}
                </Button>
              </div>
            </div>

            <div className={cn('space-y-1.5')}>
              <Label className={cn('text-muted-foreground text-xs')}>클라이언트 시크릿</Label>
              <div className={cn('flex items-center gap-2')}>
                <code
                  className={cn('bg-muted flex-1 break-all rounded px-3 py-2 font-mono text-sm')}
                >
                  {client.clientSecret}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopySecret(client.clientSecret)}
                >
                  {copiedSecret ? (
                    <Check className={cn('h-4 w-4 text-green-500')} />
                  ) : (
                    <Copy className={cn('h-4 w-4')} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className={cn('flex justify-end')}>
          <Button onClick={() => onOpenChange(false)}>확인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSuccessDialog;
