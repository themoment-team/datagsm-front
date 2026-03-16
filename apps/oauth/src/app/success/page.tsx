import { Suspense } from 'react';

import { SuccessPage } from '@/views/success';

const Success = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPage />
    </Suspense>
  );
};

export default Success;
