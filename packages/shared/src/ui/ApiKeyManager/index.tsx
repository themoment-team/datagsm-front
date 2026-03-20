'use client';

import { ApiKeyResponse, AvailableScopeListResponse, UserRoleType } from '@repo/shared/types';
import { cn } from '@repo/shared/utils';

import ApiKeyDisplay from '../ApiKeyDisplay';
import ApiKeyForm from '../ApiKeyForm';

interface ApiKeyManagerProps {
  initialApiKeyData?: ApiKeyResponse;
  initialAvailableScope?: AvailableScopeListResponse;
  userRole: UserRoleType;
  className?: string;
  showDisplay?: boolean;
}

const ApiKeyManager = ({
  initialApiKeyData,
  initialAvailableScope,
  userRole,
  className,
  showDisplay = true,
}: ApiKeyManagerProps) => {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <ApiKeyForm
        initialApiKeyData={initialApiKeyData}
        initialAvailableScope={initialAvailableScope}
        userRole={userRole}
      />
      {showDisplay && <ApiKeyDisplay initialApiKeyData={initialApiKeyData} />}
    </div>
  );
};

export default ApiKeyManager;
