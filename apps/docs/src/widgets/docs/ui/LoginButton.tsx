'use client';

import Image from 'next/image';

import { cn } from '@repo/shared/utils';

interface LoginButtonProps {
  type?: 'default' | 'icon';
  variant?: 'white' | 'black' | 'gray';
  className?: string;
}

export const LoginButton = ({
  type = 'default',
  variant = 'white',
  className,
}: LoginButtonProps) => {
  const isIcon = type === 'icon';

  const variantStyles = {
    white: 'bg-[#FFFFFF] text-[#000000] border-none',
    black: 'bg-[#000000] text-[#FFFFFF] border-none',
    gray: 'bg-[#EFEFEF] text-[#000000] border border-[#E5E5E5]',
  };

  const logoSrc = variant === 'black' ? '/images/docs/DG_white.svg' : '/images/docs/DG_black.svg';

  return (
    <div
      className={cn(
        'inline-flex cursor-pointer items-center justify-center font-medium shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]',
        isIcon ? 'h-10 w-10 rounded-full' : 'h-10 gap-4 rounded-lg px-3',
        variantStyles[variant],
        className,
      )}
    >
      <Image src={logoSrc} alt="logo" width={isIcon ? 27 : 38} height={isIcon ? 10 : 14} />
      {!isIcon && (
        <span
          className={cn('text-[14px] leading-none')}
          style={{ fontFamily: 'Pretendard, sans-serif' }}
        >
          DataGSM으로 로그인
        </span>
      )}
    </div>
  );
};
