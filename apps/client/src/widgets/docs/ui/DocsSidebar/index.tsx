'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@repo/shared/utils';
import { ChevronDown, Menu, X } from 'lucide-react';

import { docsSections } from '../../model/constants';
import { DocsSectionItem } from '../../model/types';

interface SidebarItemProps {
  item: DocsSectionItem & { icon?: React.ElementType };
  level: number;
  isActive: (href: string) => boolean;
  toggle: (href: string) => void;
  openMap: Record<string, boolean>;
  onLinkClick?: () => void;
}

const SidebarItem = ({ item, level, isActive, toggle, openMap, onLinkClick }: SidebarItemProps) => {
  const isOpen = openMap[item.href];
  const Icon = item.icon;
  const isTopLevel = level === 0;

  return (
    <div>
      <div
        className={cn(
          'flex items-center justify-between rounded-lg px-3 text-sm transition-colors',
          isTopLevel ? 'py-2' : 'py-1.5',
          isActive(item.href)
            ? `bg-primary/10 text-primary ${isTopLevel ? 'font-medium' : ''}`
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <Link
          href={item.href}
          onClick={onLinkClick}
          className={cn('flex flex-1 items-center', Icon && 'gap-3')}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {item.label}
        </Link>

        {item.children && (
          <button
            type="button"
            onClick={() => toggle(item.href)}
            className="p-1"
            aria-label={`${item.label} 토글`}
          >
            <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {item.children && isOpen && (
        <div className="mt-1 space-y-1 pl-6">
          {item.children.map((child) => (
            <SidebarItem
              key={child.href}
              item={child}
              level={level + 1}
              isActive={isActive}
              toggle={toggle}
              openMap={openMap}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  const isDescendant = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const initialMap: Record<string, boolean> = {};
    const buildMap = (items: DocsSectionItem[]) => {
      items.forEach((item) => {
        if (item.children) {
          initialMap[item.href] = isDescendant(item.href);
          buildMap(item.children);
        }
      });
    };
    buildMap(docsSections);
    return initialMap;
  });

  const toggle = (href: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  return (
    <nav className="space-y-1">
      {docsSections.map((section) => (
        <SidebarItem
          key={section.href}
          item={section}
          level={0}
          isActive={isActive}
          toggle={toggle}
          openMap={openMap}
          onLinkClick={onLinkClick}
        />
      ))}
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
