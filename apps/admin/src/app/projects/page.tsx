import { Suspense } from 'react';

import { ProjectsPage } from '@/views/projects';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPage />
    </Suspense>
  );
};

export default Page;
