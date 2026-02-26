import { TanStackProvider, ToastProvider } from '@repo/shared/lib';
import { Header } from '@repo/shared/ui';
import type { Metadata } from 'next';

import '@/shared/styles/globals.css';

export const metadata: Metadata = {
  title: 'DataGSM Docs',
  description: '광주소프트웨어마이스터고등학교 DataGSM 문서',
  openGraph: {
    title: 'DataGSM Docs',
    description: '광주소프트웨어마이스터고등학교 DataGSM 문서',
    url: 'https://datagsm-front-client.vercel.app/',
    siteName: 'DataGSM',
    images: 'https://datagsm-front-client.vercel.app/og-image.png',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <TanStackProvider>
          <ToastProvider>
            <Header role="client" />
            {children}
          </ToastProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}