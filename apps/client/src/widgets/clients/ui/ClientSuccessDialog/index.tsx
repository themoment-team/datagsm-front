'use client';

import { useCopyToClipboard } from '@repo/shared/hooks';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Label } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { AlertTriangle, Check, Copy } from 'lucide-react';

import { CreateClientData } from '@/entities/clients';

interface ClientSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: CreateClientData | null;
}

const ClientSuccessDialog = ({ open, onOpenChange, client }: ClientSuccessDialogProps) => {
  const { copied: copiedId, copy: copyClientId } = useCopyToClipboard({
    successMessage: '클라이언트 ID가 복사되었습니다.',
  });
  const { copied: copiedSecret, copy: copySecret } = useCopyToClipboard({
    successMessage: '클라이언트 시크릿이 복사되었습니다.',
  });

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-md p-0')}>
        <DialogHeader className={cn('border-b-2 border-foreground px-6 py-5')}>
          <DialogTitle className={cn('font-pixel text-[14px] leading-none flex items-center gap-2')}>
            <Check className={cn('h-4 w-4')} />
            CLIENT CREATED
          </DialogTitle>
        </DialogHeader>
        <div className={cn('space-y-4 px-6 py-6')}>
          <div
            className={cn(
              'rounded-none border-2 border-foreground/50 bg-muted p-4',
            )}
          >
            <div className={cn('flex gap-3')}>
              <AlertTriangle
                className={cn('mt-0.5 h-5 w-5 shrink-0 text-foreground')}
              />
              <div className={cn('text-sm')}>
                <p className={cn('font-mono text-xs font-medium uppercase tracking-widest')}>중요: 클라이언트 시크릿을 안전하게 저장하세요</p>
                <p className={cn('mt-1 text-muted-foreground text-xs')}>
                  클라이언트 시크릿은 이 창을 닫으면 다시 확인할 수 없습니다. 반드시 복사하여 안전한
                  곳에 보관하세요.
                </p>
              </div>
            </div>
          </div>

          <div className={cn('space-y-3')}>
            <div className={cn('space-y-1.5')}>
              <Label className={cn('font-mono text-xs uppercase tracking-widest text-muted-foreground')}>클라이언트 이름</Label>
              <p className={cn('font-mono text-sm')}>{client.clientName}</p>
            </div>

            <div className={cn('space-y-1.5')}>
              <Label className={cn('font-mono text-xs uppercase tracking-widest text-muted-foreground')}>서비스 명칭</Label>
              <p className={cn('font-mono text-sm')}>{client.serviceName}</p>
            </div>

            <div className={cn('space-y-1.5')}>
              <Label className={cn('font-mono text-xs uppercase tracking-widest text-muted-foreground')}>클라이언트 ID</Label>
              <div className={cn('flex items-center gap-2')}>
                <code
                  className={cn('bg-muted flex-1 break-all rounded-none border border-foreground/30 px-3 py-2 font-mono text-sm')}
                >
                  {client.clientId}
                </code>
                <Button variant="outline" size="icon" onClick={() => copyClientId(client.clientId)}>
                  {copiedId ? (
                    <Check className={cn('h-4 w-4')} />
                  ) : (
                    <Copy className={cn('h-4 w-4')} />
                  )}
                </Button>
              </div>
            </div>

            <div className={cn('space-y-1.5')}>
              <Label className={cn('font-mono text-xs uppercase tracking-widest text-muted-foreground')}>클라이언트 시크릿</Label>
              <div className={cn('flex items-center gap-2')}>
                <code
                  className={cn('bg-muted flex-1 break-all rounded-none border border-foreground/30 px-3 py-2 font-mono text-sm')}
                >
                  {client.clientSecret}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copySecret(client.clientSecret)}
                >
                  {copiedSecret ? (
                    <Check className={cn('h-4 w-4')} />
                  ) : (
                    <Copy className={cn('h-4 w-4')} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className={cn('flex justify-end px-6 pb-6')}>
          <Button onClick={() => onOpenChange(false)}>확인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSuccessDialog;
