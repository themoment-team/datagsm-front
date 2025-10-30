import { GoogleOAuthProvider } from '@react-oauth/google';
import { TanStackProvider, ToastProvider } from '@repo/shared/lib';
import type { Metadata } from 'next';

import '@/shared/styles/globals.css';
import { Header } from '@/shared/ui';

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
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <TanStackProvider>
            <ToastProvider>
              <Header />
              {children}
            </ToastProvider>
          </TanStackProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
