'use client';

import Link from 'next/link';

import { CLIENT_URL, COOKIE_KEYS, NAV_LINKS } from '@repo/shared/constants';
import { Button } from '@repo/shared/ui';
import { cn, deleteCookie } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Database, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  role?: 'admin' | 'client' | 'docs' | 'status';
}

const Header = ({ role = 'client' }: HeaderProps) => {
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();

    deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
    deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);

    toast.success('로그아웃 되었습니다.');

    // 상태 초기화를 위해 새로고침하며 이동
    window.location.href = '/';
  };

  const links = NAV_LINKS[role];

  return (
    <header className={cn('bg-background sticky top-0 z-50 border-b')}>
      <div className={cn('container mx-auto flex h-16 items-center justify-between px-4')}>
        <Link href={CLIENT_URL} className={cn('flex items-center gap-2 text-lg font-semibold')}>
          <div className={cn('bg-primary flex h-8 w-8 items-center justify-center rounded-lg')}>
            <Database className={cn('text-primary-foreground h-5 w-5')} />
          </div>
          <span>DataGSM</span>
        </Link>

        <nav className={cn('flex items-center gap-6')}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn('hover:text-primary text-sm font-medium transition-colors')}
            >
              {link.label}
            </Link>
          ))}
          {role === 'client' || role === 'admin' ? (
            <Button variant="outline" size="sm" onClick={handleLogout} className={cn('gap-2')}>
              <LogOut className={cn('h-4 w-4')} />
              로그아웃
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
