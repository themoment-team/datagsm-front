import { PropsWithChildren } from 'react';

import { Toaster } from 'sonner';

const ToastProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <Toaster position="bottom-right" richColors />
    </>
  );
};

export default ToastProvider;
