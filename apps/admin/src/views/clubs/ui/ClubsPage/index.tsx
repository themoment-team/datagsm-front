'use client';

import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Club, ClubType } from '@repo/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useForm, useWatch } from 'react-hook-form';

import { ClubFilterSchema, ClubFilterType } from '@/entities/club';
import { useURLFilters } from '@/shared/hooks';
import { CommonPagination } from '@/shared/ui';
import { useGetClubs } from '@/views/clubs';
import { ClubExcelActions, ClubFilter, ClubFormDialog, ClubList } from '@/widgets/clubs';

const PAGE_SIZE = 10;

const ClubsPage = () => {
  const searchParams = useSearchParams();
  const { updateURL } = useURLFilters<ClubFilterType>();

  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClub = (club: Club) => {
    setEditingClub(club);
    setIsEditDialogOpen(true);
  };

  const initialValues = useMemo(
    (): ClubFilterType & { page: number } => ({
      clubType: searchParams.get('clubType') || 'all',
      page: Number(searchParams.get('page')) || 0,
    }),
    [searchParams],
  );

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

  useEffect(() => {
    const hasChanged = filters.clubType !== initialValues.clubType;
    if (hasChanged) {
      updateURL(filters, 0);
    }
  }, [filters.clubType, initialValues.clubType, updateURL, filters]);

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
    <div className={cn('bg-background h-[calc(100vh-4.0625rem)]')}>
      <main className={cn('container mx-auto px-4 py-8')}>
        <Card>
          <CardHeader>
            <div className={cn('flex items-center justify-between')}>
              <CardTitle className={cn('text-2xl')}>동아리 관리</CardTitle>
              <div className={cn('flex items-center gap-2')}>
                <ClubExcelActions />
                <ClubFormDialog mode="create" />
              </div>
            </div>

            <ClubFilter control={control} />
          </CardHeader>
          <CardContent>
            <ClubList clubs={clubs} isLoading={isLoadingClubs} onEdit={handleEditClub} />
            <CommonPagination
              isLoading={isLoadingClubs}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>

        {editingClub && (
          <ClubFormDialog
            mode="edit"
            club={editingClub}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        )}
      </main>
    </div>
  );
};

export default ClubsPage;
