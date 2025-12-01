import { cn } from '@repo/shared/utils';

const DocsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={cn('max-w-208', 'mx-auto', 'px-8')}>
      <article className={cn('py-2')}>{children}</article>
    </div>
  );
};

export default DocsLayout;
