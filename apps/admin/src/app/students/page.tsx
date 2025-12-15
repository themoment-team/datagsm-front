import { Suspense } from 'react';

import { getClubs } from '@/entities/club';
import { StudentsPage } from '@/views/students';

const Students = async () => {
  const [initialClubsData] = await Promise.all([getClubs()]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentsPage initialClubsData={initialClubsData} />
    </Suspense>
  );
};

export default Students;
