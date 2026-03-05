'use client';

import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useURLFilters } from '@repo/shared/hooks';
import { Club, ClubType } from '@repo/shared/types';
import { Card, CardContent, CardHeader, CardTitle, CommonPagination } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useForm, useWatch } from 'react-hook-form';

import { AddClubSchema, AddClubType, ClubFilterSchema, ClubFilterType } from '@/entities/club';
import { useGetClubs } from '@/views/clubs';
import { useGetStudents } from '@/views/students';
import { ClubExcelActions, ClubFilter, ClubFormDialog, ClubList } from '@/widgets/clubs';

const PAGE_SIZE = 10;

const ClubsPage = () => {
  const searchParams = useSearchParams();
  const { updateURL } = useURLFilters<ClubFilterType>();

  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 동아리 추가/수정을 위한 폼 선언
  const clubForm = useForm<AddClubType>({
    resolver: zodResolver(AddClubSchema),
  });

  const handleEditClub = (club: Club) => {
    setEditingClub(club);
    setIsEditDialogOpen(true);
    // 수정 시 폼 데이터 초기화
    clubForm.reset({
      name: club.name,
      type: club.type,
      leaderId: club.leader.id,
    });
  };

  const initialValues = useMemo(
    (): ClubFilterType & { page: number } => ({
      clubType: searchParams.get('clubType') || 'all',
      page: Number(searchParams.get('page')) || 0,
    }),
    [searchParams],
  );

  const filterForm = useForm<ClubFilterType>({
    resolver: zodResolver(ClubFilterSchema),
    defaultValues: {
      clubType: initialValues.clubType,
    },
  });

  const { control } = filterForm;

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

  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudents(
    {},
    {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 30,
    },
  );

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
                <ClubFormDialog
                  mode="create"
                  students={studentsData?.data.students}
                  isLoadingStudents={isLoadingStudents}
                  form={clubForm}
                />
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
            students={studentsData?.data.students}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            isLoadingStudents={isLoadingStudents}
            form={clubForm}
          />
        )}
      </main>
    </div>
  );
};

export default ClubsPage;
