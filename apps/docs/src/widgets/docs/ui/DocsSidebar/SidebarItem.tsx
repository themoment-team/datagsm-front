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

const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };

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
  const active = isActive(item.href);

  return (
    <div>
      <div
        className={cn(
          'flex items-center justify-between px-2 text-xs transition-colors',
          isTopLevel ? 'py-2' : 'py-1.5',
          active
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground',
        )}
        style={monoStyle}
      >
        <Link
          href={item.href}
          onClick={onLinkClick}
          className={cn(
            'flex flex-1 items-center uppercase tracking-wide',
            Icon && 'gap-2',
            isTopLevel ? 'font-semibold' : 'font-normal',
          )}
        >
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {item.label}
        </Link>

        {item.children && (
          <button
            type="button"
            onClick={() => toggle(item.href)}
            className="cursor-pointer p-0.5"
            aria-label={`${item.label} 토글`}
          >
            <ChevronDown
              className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')}
            />
          </button>
        )}
      </div>

      {item.children && isOpen && (
        <div className="mt-0.5 space-y-0.5 border-l-2 border-foreground/20 pl-4">
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
