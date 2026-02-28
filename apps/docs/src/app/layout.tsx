import { cn } from '@repo/shared/utils';
import type { Metadata } from 'next';

import '@/shared/styles/globals.css';
import { DocsSidebar } from '@/widgets/docs';

export const metadata: Metadata = {
  title: 'DataGSM Docs',
  description: '광주소프트웨어마이스터고등학교 DataGSM 기술 문서',
  openGraph: {
    title: 'DataGSM Docs',
    description: '광주소프트웨어마이스터고등학교 DataGSM 기술 문서',
    url: 'https://datagsm-front-client.vercel.app/',
    siteName: 'DataGSM',
    images: 'https://datagsm-front-client.vercel.app/og-image.png',
    type: 'website',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <body>
        <div className={cn('container mx-auto px-4 py-12')}>
          <div className={cn('mx-auto flex max-w-7xl flex-col lg:flex-row lg:gap-8')}>
            <DocsSidebar />
            <main className={cn('min-w-0 flex-1')}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
