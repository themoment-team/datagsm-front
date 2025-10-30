'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { deleteCookie } from '@repo/shared/lib';
import { Button } from '@repo/shared/ui';
import { Database, LogOut } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    router.push('/signin');
  };

  if (pathname === '/signin') return null;

  return (
    <header className="sticky border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Database className="text-primary-foreground h-5 w-5" />
          </div>
          <span>Data GSM</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-primary text-sm font-medium transition-colors">
            메인
          </Link>
          <Link href="/docs" className="hover:text-primary text-sm font-medium transition-colors">
            독스
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="cursor-pointer gap-2">
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
