import { UserRoleType } from '@repo/shared/types';
import { cn } from '@repo/shared/utils';

import { getApiKey, getAvailableScope } from '@/views/home';
import { ApiKeyDisplay, ApiKeyFormDialog, ApiKeyHeader } from '@/widgets/home';

const HomePage = async () => {
  const userRole: UserRoleType = 'USER';

  const [initialApiKeyData, initialAvailableScope] = await Promise.all([
    getApiKey(),
    getAvailableScope(userRole),
  ]);

  return (
    <div className={cn('bg-background min-h-[calc(100vh-3.5rem)]')}>
      <main className={cn('container mx-auto px-4 py-16')}>
        <div className={cn('mx-auto max-w-2xl')}>
          <ApiKeyHeader />
          <div className={cn('flex w-full flex-col gap-5')}>
            <ApiKeyDisplay initialApiKeyData={initialApiKeyData} />
            <ApiKeyFormDialog
              initialApiKeyData={initialApiKeyData}
              initialAvailableScope={initialAvailableScope}
              userRole={userRole}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
