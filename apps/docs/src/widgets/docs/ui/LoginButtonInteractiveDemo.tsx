'use client';

import React, { useState, ReactNode, isValidElement, cloneElement } from 'react';
import { LoginButton } from './LoginButton';

interface LoginButtonInteractiveDemoProps {
  type: 'default' | 'icon';
  children: ReactNode;
}

export const LoginButtonInteractiveDemo = ({ type, children }: LoginButtonInteractiveDemoProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="flex flex-col gap-3 text-center cursor-pointer group" onClick={() => handleSelect(0)}>
          <div className={`h-32 rounded-xl flex items-center justify-center border transition-all duration-200 ${activeIndex === 0 ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'border-white/10 opacity-70 hover:opacity-100'} bg-[#000000]`}>
            <LoginButton type={type} variant="white" />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${activeIndex === 0 ? 'text-blue-500' : 'text-gray-400'}`}>On Black BG</span>
        </div>
        <div className="flex flex-col gap-3 text-center cursor-pointer group" onClick={() => handleSelect(1)}>
          <div className={`h-32 rounded-xl flex items-center justify-center border transition-all duration-200 ${activeIndex === 1 ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'border-gray-100 shadow-inner opacity-70 hover:opacity-100'} bg-[#FFFFFF]`}>
            <LoginButton type={type} variant="black" />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${activeIndex === 1 ? 'text-blue-500' : 'text-gray-400'}`}>On White BG</span>
        </div>
        <div className="flex flex-col gap-3 text-center cursor-pointer group" onClick={() => handleSelect(2)}>
          <div className={`h-32 rounded-xl flex items-center justify-center border transition-all duration-200 ${activeIndex === 2 ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'border-gray-100 shadow-inner opacity-70 hover:opacity-100'} bg-[#FFFFFF]`}>
            <LoginButton type={type} variant="gray" />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${activeIndex === 2 ? 'text-blue-500' : 'text-gray-400'}`}>On White BG (Gray)</span>
        </div>
      </div>
      
      {React.Children.map(children, child => {
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<any>, { 
            activeTabIndex: activeIndex,
            onChange: (index: number) => setActiveIndex(index)
          });
        }
        return child;
      })}
    </>
  );
};
