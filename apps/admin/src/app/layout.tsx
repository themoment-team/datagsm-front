import { TanStackProvider, ToastProvider } from '@repo/shared/lib';
import { Header } from '@repo/shared/ui';
import type { Metadata } from 'next';

import '@/shared/styles/globals.css';

import AuthGuard from './AuthGuard';

export const metadata: Metadata = {
  title: 'datagsm-admin',
  description: '광주소프트웨어마이스터고등학교 OpenAPI 서비스 관리 페이지',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body>
        <TanStackProvider>
          <ToastProvider>
            <AuthGuard>
              <Header role="admin" />
              {children}
            </AuthGuard>
          </ToastProvider>
        </TanStackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
