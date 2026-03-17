'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { COOKIE_KEYS, NAV_LINKS } from '@repo/shared/constants';
import { cn, deleteCookie } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  role?: 'admin' | 'client';
}

const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };
const pixelStyle = { fontFamily: '"Press Start 2P", monospace' };

const Header = ({ role = 'client' }: HeaderProps) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();

    deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
    deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);

    toast.success('로그아웃 되었습니다.');

    window.location.href = '/';
  };

  const PUBLIC_ROUTES = ['/signup'];
  if (PUBLIC_ROUTES.includes(pathname)) return null;

  const links = NAV_LINKS[role];

  return (
    <header
      className={cn('bg-background sticky top-0 z-50')}
      style={{ borderBottom: '2px solid oklch(0.04 0 0)' }}
    >
      <div className={cn('container mx-auto flex h-14 items-center justify-between px-4')}>
        {/* Logo */}
        <Link href="/" className={cn('flex items-center gap-3')}>
          <div
            className={cn(
              'flex h-7 w-7 flex-shrink-0 items-center justify-center bg-foreground text-background',
            )}
            style={{ ...pixelStyle, fontSize: '9px' }}
          >
            D
          </div>
          <span
            className={cn('text-foreground hidden sm:block')}
            style={{ ...pixelStyle, fontSize: '10px' }}
          >
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
                'text-muted-foreground hover:text-foreground hidden text-xs uppercase tracking-widest transition-colors sm:block',
              )}
              style={monoStyle}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 border border-foreground px-3 py-1.5 text-xs uppercase tracking-widest transition-all hover:bg-foreground hover:text-background',
            )}
            style={monoStyle}
          >
            <LogOut className={cn('h-3 w-3')} />
            <span className={cn('hidden sm:block')}>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
