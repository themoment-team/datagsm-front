import * as React from 'react';

import { cn } from '@repo/shared/utils';

interface SectionCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  shadow?: boolean;
  headerAction?: React.ReactNode;
}

function SectionCard({ title, icon, shadow = false, headerAction, className, children, ...props }: SectionCardProps) {
  return (
    <div
      className={cn('border-2 border-foreground', shadow && 'pixel-shadow', className)}
      {...props}
    >
      <div className={cn('flex items-center justify-between border-b-2 border-foreground bg-foreground px-5 py-2.5')}>
        <div className={cn('flex items-center gap-2')}>
          {icon && <span className={cn('text-background [&_svg]:h-3.5 [&_svg]:w-3.5')}>{icon}</span>}
          <span className={cn('text-xs font-mono uppercase tracking-widest text-background')}>{title}</span>
        </div>
        {headerAction && (
          <span className={cn('text-background/70 font-mono text-xs uppercase tracking-widest')}>{headerAction}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export { SectionCard };
