import * as React from 'react';

import { cn } from '@repo/shared/utils';

interface PixelIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive';
  size?: 'default' | 'sm';
}

const PixelIconButton = React.forwardRef<HTMLButtonElement, PixelIconButtonProps>(
  ({ variant = 'default', size = 'default', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'cursor-pointer items-center justify-center border transition-all',
          size === 'default' ? 'flex h-7 w-7' : 'flex h-6 w-6',
          variant === 'default'
            ? size === 'sm'
              ? 'border-foreground/35 hover:border-foreground hover:bg-foreground hover:text-background'
              : 'border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background'
            : 'border-destructive/35 text-destructive hover:bg-destructive hover:text-white',
          className,
        )}
        {...props}
      />
    );
  },
);

PixelIconButton.displayName = 'PixelIconButton';

export { PixelIconButton };
