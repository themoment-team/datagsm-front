import type { Metadata } from 'next';

import TanStackProvider from '@/shared/lib/TanStackProvider';
import '@/shared/styles/globals.css';

export const metadata: Metadata = {
  title: 'datagsm-client',
  description: '광주소프트웨어마이스터고등학교 OpenAPI 서비스 클라이언트 페이지',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body>
        <TanStackProvider>{children}</TanStackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
