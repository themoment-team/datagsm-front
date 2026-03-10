'use client';

import { cn } from '@repo/shared/utils';

interface LoginButtonProps {
  type?: 'default' | 'icon';
  variant?: 'white' | 'black' | 'gray';
  className?: string;
}

export const LoginButton = ({ type = 'default', variant = 'white', className }: LoginButtonProps) => {
  const isIcon = type === 'icon';

  const variantStyles = {
    white: 'bg-[#FFFFFF] text-[#000000] border-none',
    black: 'bg-[#000000] text-[#FFFFFF] border-none',
    gray: 'bg-[#EFEFEF] text-[#000000] border border-[#E5E5E5]',
  };

  const logoSrc = variant === 'black' ? '/images/docs/DG_white.png' : '/images/docs/DG_black.png';

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center cursor-pointer font-medium transition-all duration-200 active:scale-[0.98] shadow-sm hover:opacity-90',
        isIcon ? 'h-10 w-10 rounded-full' : 'h-10 rounded-lg px-3 gap-4',
        variantStyles[variant],
        className,
      )}
    >
      <img src={logoSrc} alt="logo" className={cn(isIcon ? 'h-[10px]' : 'h-[14px]')} />
      {!isIcon && (
        <span className={cn('text-[14px] leading-none')} style={{ fontFamily: 'Pretendard, sans-serif' }}>
          DataGSM으로 로그인
        </span>
      )}
    </div>
  );
};
