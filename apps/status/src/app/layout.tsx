import { TanStackProvider, ToastProvider } from '@repo/shared/lib';
import { Header, TooltipProvider } from '@repo/shared/ui';
import type { Metadata } from 'next';

import '@/shared/styles/globals.css';

export const metadata: Metadata = {
  title: 'DataGSM Status',
  description: '광주소프트웨어마이스터고등학교 OpenAPI & OAuth 플랫폼 상태 페이지',
  openGraph: {
    title: 'DataGSM Status',
    description: '광주소프트웨어마이스터고등학교 OpenAPI & OAuth 플랫폼 상태 페이지',
    url: 'https://datagsm-front-status.vercel.app/',
    siteName: 'DataGSM Status',
    images: 'https://datagsm-front-status.vercel.app/og-image.png',
    type: 'website',
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body>
        <TanStackProvider>
          <ToastProvider>
            <TooltipProvider>
              <Header role="status" />
              {children}
            </TooltipProvider>
          </ToastProvider>
        </TanStackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
