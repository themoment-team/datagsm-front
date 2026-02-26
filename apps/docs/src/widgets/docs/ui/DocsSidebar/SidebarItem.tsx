import Link from 'next/link';

import { cn } from '@repo/shared/utils';
import { ChevronDown } from 'lucide-react';

import { DocsSectionItem } from '../../model/types';

export interface SidebarItemProps {
  item: DocsSectionItem;
  level: number;
  isActive: (href: string) => boolean;
  toggle: (href: string) => void;
  openMap: Record<string, boolean>;
  onLinkClick?: () => void;
}

export const SidebarItem = ({
  item,
  level,
  isActive,
  toggle,
  openMap,
  onLinkClick,
}: SidebarItemProps) => {
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
            className="cursor-pointer p-1"
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
