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
    <div className={cn('bg-background h-[calc(100vh-4.0625rem)]')}>
      <main className={cn('container mx-auto px-4 py-16')}>
        <div className={cn('mx-auto max-w-2xl')}>
          <ApiKeyHeader />
          <div className={cn('flex flex-col items-center gap-6')}>
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
