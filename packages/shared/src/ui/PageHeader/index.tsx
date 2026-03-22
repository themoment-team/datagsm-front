import * as React from 'react';

import { cn } from '@repo/shared/utils';

interface PageHeaderProps {
  breadcrumb: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
}

function PageHeader({ breadcrumb, title, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 flex items-end justify-between border-b-2 border-foreground pb-4',
        className,
      )}
    >
      <div>
        <p className={cn('mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground')}>
          {breadcrumb}
        </p>
        <h1 className={cn('font-pixel text-[15px] leading-tight text-foreground')}>{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export { PageHeader };
