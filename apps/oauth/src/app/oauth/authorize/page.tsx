import { Suspense } from 'react';

import { OAuthAuthorizePage } from '@/views/oauth';

const OAuthAuthorize = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthAuthorizePage />
    </Suspense>
  );
};

export default OAuthAuthorize;
