'use client';

import { useState } from 'react';

import { ApiKeyResponse, AvailableScopeListResponse, UserRoleType } from '@repo/shared/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

import ApiKeyDisplay from '../ApiKeyDisplay';
import ApiKeyForm from '../ApiKeyForm';

interface ApiKeyFormDialogProps {
  trigger?: React.ReactNode;
  initialApiKeyData?: ApiKeyResponse;
  initialAvailableScope?: AvailableScopeListResponse;
  userRole: UserRoleType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const pixelStyle = { fontFamily: '"Press Start 2P", monospace' };
const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };

const ApiKeyFormDialog = ({
  trigger,
  initialApiKeyData,
  initialAvailableScope,
  userRole,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ApiKeyFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const defaultTrigger = (
    <button
      className={cn(
        'cursor-pointer border-2 border-foreground bg-foreground px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground',
      )}
      style={monoStyle}
    >
      API 키 관리
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>}
      <DialogContent
        className={cn('max-h-[90vh] min-w-[35vw] max-w-none overflow-y-auto border-2 border-foreground p-0')}
        style={{ boxShadow: '6px 6px 0 0 oklch(0.04 0 0)' }}
      >
        {/* Terminal title bar */}
        <div className={cn('flex items-center gap-2 border-b-2 border-foreground bg-foreground px-5 py-3')}>
          <div className={cn('h-2.5 w-2.5 border border-background/25 bg-background/15')} />
          <div className={cn('h-2.5 w-2.5 border border-background/25 bg-background/15')} />
          <div className={cn('h-2.5 w-2.5 border border-background/25 bg-background/15')} />
          <span
            className={cn('ml-2 text-xs uppercase tracking-widest text-background/80')}
            style={monoStyle}
          >
            KEY MANAGER
          </span>
        </div>

        <DialogHeader className={cn('px-8 pb-0 pt-8')}>
          <div className={cn('flex flex-col items-center gap-3 text-center')}>
            {/* Pixel grid accent */}
            <div className={cn('flex items-center gap-1')}>
              {[
                [1, 0, 1],
                [0, 1, 0],
                [1, 0, 1],
              ].map((row, ri) => (
                <div key={ri} className={cn('flex flex-col gap-1')}>
                  {row.map((filled, ci) => (
                    <div
                      key={ci}
                      className={cn(
                        'h-2 w-2',
                        filled ? 'bg-foreground' : 'border border-foreground',
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
            <DialogTitle style={{ ...pixelStyle, fontSize: '14px', lineHeight: '1.8' }}>
              ADMIN API Key
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className={cn('flex flex-col gap-5 p-6')}>
          <ApiKeyForm
            initialApiKeyData={initialApiKeyData}
            initialAvailableScope={initialAvailableScope}
            userRole={userRole}
          />
          <ApiKeyDisplay initialApiKeyData={initialApiKeyData} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyFormDialog;
