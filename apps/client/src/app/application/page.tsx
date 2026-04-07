import { Suspense } from 'react';

import { ApplicationPage } from '@/views/application';

const Application = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationPage />
    </Suspense>
  );
};

export default Application;
