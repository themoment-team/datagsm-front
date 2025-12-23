'use client';

import { useState } from 'react';

import Link from 'next/link';

import { cn } from '@repo/shared/utils';
import { ChevronDown, Menu, X } from 'lucide-react';

import { docsSections } from '@/widgets/docs/config/docsSections';
import { useDocsSidebar } from '@/widgets/docs/model/useDocsSidebar';

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const { isActive, isDescendant } = useDocsSidebar();

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(docsSections.map((section) => [section.href, isDescendant(section.href)])),
  );

  const toggle = (href: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  return (
    <nav className="space-y-1">
      {docsSections.map(({ label, href, icon: Icon, children }) => {
        const isOpen = openMap[href];

        return (
          <div key={href}>
            <div
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                isActive(href)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Link href={href} onClick={onLinkClick} className="flex flex-1 items-center gap-3">
                <Icon className="h-4 w-4" />
                {label}
              </Link>

              {children && (
                <button
                  type="button"
                  onClick={() => toggle(href)}
                  className="p-1"
                  aria-label={`${label} 토글`}
                >
                  <ChevronDown
                    className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                  />
                </button>
              )}
            </div>

            {children && isOpen && (
              <div className="mt-1 space-y-1 pl-9">
                {children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onLinkClick}
                    className={cn(
                      'block rounded-md px-3 py-1.5 text-sm transition-colors',
                      isActive(child.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

const DocsSidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
        >
          <Menu className="h-4 w-4" />
          목차
        </button>
      </div>

      <aside className="sticky top-24 hidden h-fit w-64 shrink-0 lg:block">
        <h2 className="text-muted-foreground mb-4 text-sm font-semibold">목차</h2>
        <SidebarContent />
      </aside>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="bg-background fixed left-0 top-0 z-50 h-full w-64 shadow-xl lg:hidden">
            <div className="p-4">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-semibold">목차</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-muted rounded-md p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default DocsSidebar;
