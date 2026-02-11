import { cookies } from 'next/headers';

import { TanStackProvider, ToastProvider } from '@repo/shared/lib';
import { Header } from '@repo/shared/ui';
import type { Metadata } from 'next';

import { COOKIE_KEYS } from '@repo/shared/constants';

import { GoogleAnalytics } from '@/shared/lib';
import '@/shared/styles/globals.css';

export const metadata: Metadata = {
  title: 'DataGSM',
  description: '광주소프트웨어마이스터고등학교 OpenAPI & OAuth 플랫폼',
  openGraph: {
    title: 'DataGSM',
    description: '광주소프트웨어마이스터고등학교 OpenAPI & OAuth 플랫폼',
    url: 'https://datagsm-front-client.vercel.app/',
    siteName: 'DataGSM',
    images: 'https://datagsm-front-client.vercel.app/og-image.png',
    type: 'website',
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  return (
    <html lang="ko">
      <body>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        )}
        <TanStackProvider>
          <ToastProvider>
            {accessToken && <Header role="client" />}
            {children}
          </ToastProvider>
        </TanStackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
