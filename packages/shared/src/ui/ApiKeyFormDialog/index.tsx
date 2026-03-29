'use client';

import { useState } from 'react';

import { ApiKeyResponse, AvailableScopeListResponse, UserRoleType } from '@repo/shared/types';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/shared/ui';
import { XIcon } from 'lucide-react';
import { cn } from '@repo/shared/utils';

import ApiKeyManager from '../ApiKeyManager';

interface ApiKeyFormDialogProps {
  trigger?: React.ReactNode;
  initialApiKeyData?: ApiKeyResponse;
  initialAvailableScope?: AvailableScopeListResponse;
  userRole: UserRoleType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

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
        'cursor-pointer border-2 border-foreground bg-foreground px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-background hover:text-foreground font-mono',
      )}
    >
      API 키 관리
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className={cn('max-h-[90vh] min-w-[55vw] max-w-none overflow-y-auto p-0 pixel-shadow-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]')}
      >
        {/* Terminal title bar */}
        <div className={cn('flex items-center gap-2 border-b-2 border-foreground bg-foreground px-5 py-3')}>
          <div className={cn('h-2.5 w-2.5 border border-background/25 bg-background/15')} />
          <div className={cn('h-2.5 w-2.5 border border-background/25 bg-background/15')} />
          <div className={cn('h-2.5 w-2.5 border border-background/25 bg-background/15')} />
          <span
            className={cn('ml-2 text-xs uppercase tracking-widest text-background/80 font-mono')}
          >
            KEY MANAGER
          </span>
          <DialogClose className={cn('ml-auto flex h-6 w-6 cursor-pointer items-center justify-center border border-background/30 text-background transition-all hover:border-background hover:bg-background hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-3')}>
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>
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
            <DialogTitle className="font-pixel text-[14px] leading-[1.8]">
              {userRole === 'ADMIN' ? 'ADMIN API Key' : 'API Key Management'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <ApiKeyManager
          className="p-6"
          initialApiKeyData={initialApiKeyData}
          initialAvailableScope={initialAvailableScope}
          userRole={userRole}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyFormDialog;