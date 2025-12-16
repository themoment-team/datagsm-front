import { Suspense } from 'react';

import { ClubsPage } from '@/views/clubs';

const Clubs = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClubsPage />
    </Suspense>
  );
};

export default Clubs;
