'use client';

import { useEffect } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClubType } from '@repo/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared/ui';
import { useForm, useWatch } from 'react-hook-form';

import { ClubFilterSchema, ClubFilterType } from '@/entities/club';
import { useGetClubs } from '@/views/clubs';
import {
  ClubExcelActions,
  ClubFilter,
  ClubFormDialog,
  ClubList,
  ClubPagination,
} from '@/widgets/clubs';

const PAGE_SIZE = 10;

const ClubsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialValues = (): ClubFilterType & { page: number } => ({
    clubType: searchParams.get('clubType') || 'all',
    page: Number(searchParams.get('page')) || 0,
  });

  const initialValues = getInitialValues();

  const form = useForm<ClubFilterType>({
    resolver: zodResolver(ClubFilterSchema),
    defaultValues: {
      clubType: initialValues.clubType,
    },
  });

  const { control } = form;

  const filters = useWatch({
    control,
  });

  const currentPage = initialValues.page;

  const updateURL = (newFilters: Partial<ClubFilterType>, newPage?: number) => {
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

  useEffect(() => {
    const hasChanged = filters.clubType !== initialValues.clubType;

    if (filters && hasChanged) {
      updateURL(filters, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.clubType]);

  const handlePageChange = (page: number) => {
    updateURL(filters, page);
  };

  const queryParams = {
    page: currentPage,
    size: PAGE_SIZE,
    clubType: filters.clubType !== 'all' ? (filters.clubType as ClubType) : undefined,
  };

  const { data: clubsData, isLoading: isLoadingClubs } = useGetClubs(queryParams);

  const clubs = clubsData?.data.clubs || [];

  const totalPages = clubsData?.data.totalPages ?? 0;

  return (
    <div className="bg-background h-[calc(100vh-4.0625rem)]">
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">동아리 관리</CardTitle>
              <div className="flex items-center gap-2">
                <ClubExcelActions />
                <ClubFormDialog />
              </div>
            </div>

            <ClubFilter control={control} />
          </CardHeader>
          <CardContent>
            <ClubList clubs={clubs} isLoading={isLoadingClubs} />
            <ClubPagination
              isLoading={isLoadingClubs}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClubsPage;
