import '@repo/ui/styles.css';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'datagsm - admin',
  description: 'Admin panel for datagsm',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
