'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { docsSections } from '../../model/constants';
import { DocsSectionItem } from '../../model/types';
import { SidebarItem } from './SidebarItem';

export const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();

  // 정확히 일치하는 경우 활성 스타일 적용
  const isActive = (href: string) => pathname === href;

  // 초기 openMap: 현재 경로의 부모 섹션들을 자동으로 열어둠
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const initialMap: Record<string, boolean> = {};
    const buildMap = (items: DocsSectionItem[]) => {
      items.forEach((item) => {
        if (item.children) {
          initialMap[item.href] = pathname === item.href || pathname.startsWith(`${item.href}/`);
          buildMap(item.children);
        }
      });
    };
    buildMap(docsSections);
    return initialMap;
  });

  // pathname이 변경될 때 해당 경로의 부모 섹션들을 자동으로 열어줌
  // 수동으로 열어둔 섹션은 닫지 않음
  useEffect(() => {
    setOpenMap((prev) => {
      const updated = { ...prev };
      const buildMap = (items: DocsSectionItem[]) => {
        items.forEach((item) => {
          if (item.children) {
            if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
              updated[item.href] = true;
            }
            buildMap(item.children);
          }
        });
      };
      buildMap(docsSections);
      return updated;
    });
  }, [pathname]);

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
