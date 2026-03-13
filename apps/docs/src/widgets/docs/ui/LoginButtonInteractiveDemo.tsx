'use client';

import React, { ReactNode, isValidElement, cloneElement, useState } from 'react';

import { cn } from '@repo/shared/utils';

import { LoginButton } from './LoginButton';

interface LoginButtonInteractiveDemoProps {
  type: 'default' | 'icon';
  children: ReactNode;
}

const VARIANTS = [
  {
    label: 'On Black BG',
    variant: 'white',
    bgColor: 'bg-[#000000]',
    borderColor: 'border-white/10',
  },
  {
    label: 'On White BG',
    variant: 'black',
    bgColor: 'bg-[#FFFFFF]',
    borderColor: 'border-gray-100',
  },
  {
    label: 'On White BG (Gray)',
    variant: 'gray',
    bgColor: 'bg-[#FFFFFF]',
    borderColor: 'border-gray-100',
  },
] as const;

export const LoginButtonInteractiveDemo = ({ type, children }: LoginButtonInteractiveDemoProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className={cn('my-8 grid grid-cols-1 gap-6 md:grid-cols-3')}>
        {VARIANTS.map((item, index) => (
          <div
            key={item.label}
            className={cn('flex cursor-pointer flex-col gap-3 text-center')}
            onClick={() => setActiveIndex(index)}
          >
            <div
              className={cn(
                'flex h-32 items-center justify-center rounded-xl border transition-all duration-200',
                item.bgColor,
                activeIndex === index
                  ? 'ring-primary border-transparent shadow-md ring-2'
                  : cn(item.borderColor, 'opacity-70 hover:opacity-100'),
              )}
            >
              <LoginButton type={type} variant={item.variant} />
            </div>
            <span
              className={cn(
                'text-[11px] font-bold uppercase tracking-widest transition-colors',
                activeIndex === index ? 'text-primary' : 'text-gray-400',
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {React.Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(
            child as React.ReactElement<{
              activeTabIndex?: number;
              onChange?: (index: number) => void;
            }>,
            {
              activeTabIndex: activeIndex,
              onChange: setActiveIndex,
            },
          );
        }
        return child;
      })}
    </>
  );
};
