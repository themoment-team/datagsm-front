'use client';

import { ApiKeyRenewableResponse, ApiKeyResponse } from '@/entities/home';
import { ApiKeyCard, ApiKeyHeader } from '@/widgets/home';

interface HomePageProps {
  initialApiKeyData?: ApiKeyResponse;
  initialApiKeyRenewableData?: ApiKeyRenewableResponse;
}

const HomePage = ({ initialApiKeyData, initialApiKeyRenewableData }: HomePageProps) => {
  return (
    <div className="bg-background h-[calc(100vh-4.0625rem)]">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
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
