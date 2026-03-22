'use client';

import * as React from 'react';

import { cn } from '@repo/shared/utils';

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const Tooltip = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('group relative inline-block', className)}>{children}</div>
);

const TooltipTrigger = ({
  children,
  asChild,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props);
  }
  return <div {...props}>{children}</div>;
};

const TooltipContent = ({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<'div'> & { sideOffset?: number }) => (
  <div
    role="tooltip"
    className={cn(
      'bg-popover text-popover-foreground pointer-events-none invisible absolute right-0 top-full z-50 whitespace-nowrap rounded-none border-2 border-foreground px-3 py-1.5 text-xs pixel-shadow group-focus-within:visible group-hover:visible',
      className,
    )}
    style={{ marginTop: sideOffset }}
    {...props}
  >
    {children}
  </div>
);

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
