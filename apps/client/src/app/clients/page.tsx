import { Suspense } from 'react';

import { ClientsPage } from '@/views/clients';

const Client = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientsPage />
    </Suspense>
  );
};

export default Client;
