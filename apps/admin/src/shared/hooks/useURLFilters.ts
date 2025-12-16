import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useURLFilters = <T extends Record<string, string | number>>() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateURL = (newFilters: Partial<T>, newPage?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // 필터 업데이트
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // 페이지 업데이트
    if (newPage !== undefined) {
      if (newPage === 0) {
        params.delete('page');
      } else {
        params.set('page', newPage.toString());
      }
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { updateURL };
};
