'use client';

import { usePathname } from 'next/navigation';

export const useDocsSidebar = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const isDescendant = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return {
    pathname,
    isActive,
    isDescendant,
  };
};
