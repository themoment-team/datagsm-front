import { TanStackProvider, ToastProvider } from '@repo/shared/lib';
import { Header, TooltipProvider } from '@repo/shared/ui';
import type { Metadata } from 'next';
import { DM_Sans, JetBrains_Mono, Press_Start_2P } from 'next/font/google';

import { GoogleAnalytics } from '@/shared/lib';
import { SoundModeProvider } from '@/shared/sound-mode';
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
  return (
    <html
      lang="ko"
      className={`${pressStart2P.variable} ${jetbrainsMono.variable} ${dmSans.variable}`}
    >
      <body>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        )}
        <TanStackProvider>
          <ToastProvider>
            <TooltipProvider>
              <SoundModeProvider>
                <Header role="client" />
                {children}
              </SoundModeProvider>
            </TooltipProvider>
          </ToastProvider>
        </TanStackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
