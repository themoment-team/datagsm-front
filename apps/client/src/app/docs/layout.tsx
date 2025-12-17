import { cn } from '@repo/shared/utils';

import { DocsSidebar } from '@/widgets/docs';

const DocsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={cn('container mx-auto px-4 py-12 pr-[17rem]')}>
      <div className={cn('mx-auto flex max-w-7xl gap-8')}>
        <DocsSidebar />
        <main className={cn('min-w-0 flex-1')}>{children}</main>
      </div>
    </div>
  );
};
export default DocsLayout;
