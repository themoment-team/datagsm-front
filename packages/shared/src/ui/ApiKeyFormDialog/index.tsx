'use client';

import { useState } from 'react';

import { ApiKeyResponse, AvailableScopeListResponse, UserRoleType } from '@repo/shared/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Key } from 'lucide-react';

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
    <Button variant="default" className="gap-2">
      <Key className="h-4 w-4" />
      API 키 관리
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>}
      <DialogContent className={cn('max-h-[90vh] min-w-[35vw] max-w-none overflow-y-auto p-0')}>
        <DialogHeader className="p-24 pb-0">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-primary/10 inline-flex h-16 w-16 items-center justify-center rounded-full">
              <Key className="text-primary h-8 w-8" />
            </div>
            <DialogTitle className="text-3xl font-bold">
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
