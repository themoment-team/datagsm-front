import { Suspense } from 'react';

import { ApiKeyPage } from '@/views/api-keys';

const ApiKey = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApiKeyPage />
    </Suspense>
  );
};

export default ApiKey;
