import { cn } from '@repo/shared/lib';

import { getApiKey, getApiKeyRenewable } from '@/views/home';
import { ApiKeyCard, ApiKeyHeader } from '@/widgets/home';

const HomePage = async () => {
  const [initialApiKeyData, initialApiKeyRenewableData] = await Promise.all([
    getApiKey(),
    getApiKeyRenewable(),
  ]);

  return (
    <div className={cn('bg-background h-[calc(100vh-4.0625rem)]')}>
      <main className={cn('container mx-auto px-4 py-16')}>
        <div className={cn('mx-auto max-w-2xl')}>
          <ApiKeyHeader />
          <ApiKeyCard
            initialApiKeyData={initialApiKeyData}
            initialApiKeyRenewableData={initialApiKeyRenewableData}
          />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
