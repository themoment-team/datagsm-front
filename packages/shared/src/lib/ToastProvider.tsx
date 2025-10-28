import { PropsWithChildren } from 'react';

import { Toaster } from 'sonner';

const ToastProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      {children}
    </>
  );
};

export default ToastProvider;
