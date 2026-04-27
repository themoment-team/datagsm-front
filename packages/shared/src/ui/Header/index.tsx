'use client';

import Link from 'next/link';

import { CLIENT_URL, COOKIE_KEYS, NAV_LINKS } from '@repo/shared/constants';
import { cn, deleteCookie } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
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

    window.location.href = '/';
  };

  const links = NAV_LINKS[role];

  return (
    <header className={cn('bg-background border-foreground sticky top-0 z-50 border-b-2')}>
      <div className={cn('container mx-auto flex h-14 items-center justify-between px-4')}>
        {/* Logo */}
        <Link href={CLIENT_URL} className={cn('flex items-center gap-3')}>
          <div
            className={cn(
              'bg-foreground text-background font-pixel flex h-7 w-7 flex-shrink-0 items-center justify-center text-[9px]',
            )}
          >
            D
          </div>
          <span className={cn('text-foreground font-pixel hidden text-[10px] sm:block')}>
            DataGSM
          </span>
        </Link>

        {/* Nav */}
        <nav className={cn('flex items-center gap-5')}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-muted-foreground hover:text-foreground hidden font-mono text-xs uppercase tracking-widest transition-colors sm:block',
              )}
            >
              {link.label}
            </Link>
          ))}
          {(role === 'client' || role === 'admin') && (
            <button
              onClick={handleLogout}
              className={cn(
                'border-foreground hover:bg-foreground hover:text-background flex cursor-pointer items-center gap-1.5 border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-all',
              )}
            >
              <LogOut className={cn('h-3 w-3')} />
              <span className={cn('hidden sm:block')}>Logout</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
