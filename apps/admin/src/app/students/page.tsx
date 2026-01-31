import { Suspense } from 'react';

import { StudentsPage } from '@/views/students';

const Students = async () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentsPage />
    </Suspense>
  );
};

export default Students;
