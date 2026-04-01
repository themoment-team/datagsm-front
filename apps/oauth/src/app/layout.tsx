import { TanStackProvider, ToastProvider } from '@repo/shared/lib';
import { TooltipProvider } from '@repo/shared/ui';
import type { Metadata } from 'next';
import { DM_Sans, JetBrains_Mono, Press_Start_2P } from 'next/font/google';

import '@/shared/styles/globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'DataGSM-OAuth',
  description: '광주소프트웨어마이스터고등학교 OpenAPI & OAuth 플랫폼 인증 서버',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="ko"
      className={`${pressStart2P.variable} ${jetbrainsMono.variable} ${dmSans.variable}`}
    >
      <body>
        <TanStackProvider>
          <ToastProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ToastProvider>
        </TanStackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
