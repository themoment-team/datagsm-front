'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { docsSections } from '../../model/constants';
import { DocsSectionItem } from '../../model/types';
import { SidebarItem } from './SidebarItem';

const STORAGE_KEY = 'docs-sidebar-open-map';

export const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();

  // 정확히 일치하는 경우 활성 스타일 적용
  const isActive = (href: string) => pathname === href;

  const buildOpenMap = (base: Record<string, boolean>, currentPathname: string) => {
    const result = { ...base };
    const traverse = (items: DocsSectionItem[]) => {
      items.forEach((item) => {
        if (item.children) {
          if (currentPathname === item.href || currentPathname.startsWith(`${item.href}/`)) {
            result[item.href] = true;
          }
          traverse(item.children);
        }
      });
    };
    traverse(docsSections);
    return result;
  };

  // 초기 openMap: 서버/클라이언트 모두 pathname 기준으로 동일하게 생성 (hydration 안전)
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => buildOpenMap({}, pathname));

  // 마운트 후 sessionStorage에 저장된 상태를 병합 (클라이언트 전용)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const storedMap: Record<string, boolean> = JSON.parse(stored);
        setOpenMap((prev) => ({ ...storedMap, ...prev }));
      }
    } catch {
      // sessionStorage 사용 불가 환경에서는 무시
    }
  }, []);

  // openMap이 변경될 때마다 sessionStorage에 저장
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(openMap));
    } catch {
      // sessionStorage 사용 불가 환경에서는 무시
    }
  }, [openMap]);

  // pathname이 변경될 때 해당 경로의 부모 섹션들을 자동으로 열어줌
  // 수동으로 열어둔 섹션은 닫지 않음
  useEffect(() => {
    setOpenMap((prev) => buildOpenMap(prev, pathname));
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
