'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClubListResponse, Student, StudentRole, StudentSex } from '@repo/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useForm, useWatch } from 'react-hook-form';

import { StudentFilterSchema, StudentFilterType } from '@/entities/student';
import { useGetStudents } from '@/views/students';
import {
  StudentExcelActions,
  StudentFilter,
  StudentFormDialog,
  StudentList,
  StudentPagination,
} from '@/widgets/students';

const PAGE_SIZE = 10;

interface StudentsPageProps {
  initialClubsData?: ClubListResponse;
}

const StudentsPage = ({ initialClubsData }: StudentsPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const getInitialValues = (): StudentFilterType & { page: number } => ({
    grade: searchParams.get('grade') || 'all',
    classNum: searchParams.get('classNum') || 'all',
    sex: searchParams.get('sex') || 'all',
    role: searchParams.get('role') || 'all',
    status: searchParams.get('status') || 'all',
    page: Number(searchParams.get('page')) || 0,
  });

  const initialValues = getInitialValues();

  const form = useForm<StudentFilterType>({
    resolver: zodResolver(StudentFilterSchema),
    defaultValues: {
      grade: initialValues.grade,
      classNum: initialValues.classNum,
      sex: initialValues.sex,
      role: initialValues.role,
      status: initialValues.status,
    },
  });

  const { control } = form;

  const filters = useWatch({
    control,
  });

  const currentPage = initialValues.page;

  const updateURL = (newFilters: Partial<StudentFilterType>, newPage?: number) => {
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
    // 초기 로드 시에는 URL 업데이트를 건너뜀
    const hasChanged =
      filters.grade !== initialValues.grade ||
      filters.classNum !== initialValues.classNum ||
      filters.sex !== initialValues.sex ||
      filters.role !== initialValues.role ||
      filters.status !== initialValues.status;

    if (filters && hasChanged) {
      updateURL(filters, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.grade, filters.classNum, filters.sex, filters.role, filters.status]);

  const handlePageChange = (page: number) => {
    updateURL(filters, page);
  };

  const queryParams = {
    page: currentPage,
    size: PAGE_SIZE,
    grade: filters.grade !== 'all' ? Number(filters.grade) : undefined,
    classNum: filters.classNum !== 'all' ? Number(filters.classNum) : undefined,
    sex: filters.sex !== 'all' ? (filters.sex as StudentSex) : undefined,
    role: filters.role !== 'all' ? (filters.role as StudentRole) : undefined,
    isLeaveSchool: filters.status !== 'all' ? filters.status === 'true' : undefined,
  };

  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudents(queryParams);

  const students = studentsData?.data.students;

  const totalPages = studentsData?.data.totalPages ?? 0;

  return (
    <div className={cn('bg-background h-[calc(100vh-4.0625rem)]')}>
      <main className={cn('container mx-auto px-4 py-8')}>
        <Card>
          <CardHeader>
            <div className={cn('flex items-center justify-between')}>
              <CardTitle className={cn('text-2xl')}>학생 관리</CardTitle>
              <div className={cn('flex items-center gap-2')}>
                <StudentExcelActions />
                <StudentFormDialog mode="create" clubs={initialClubsData?.data} />
              </div>
            </div>

            <StudentFilter control={control} />
          </CardHeader>
          <CardContent>
            <div className={cn('space-y-4')}>
              <StudentList
                students={students}
                isLoading={isLoadingStudents}
                onEdit={handleEditStudent}
              />
              <StudentPagination
                isLoading={isLoadingStudents}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </CardContent>
        </Card>

        {editingStudent && (
          <StudentFormDialog
            mode="edit"
            student={editingStudent}
            clubs={initialClubsData?.data}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        )}
      </main>
    </div>
  );
};

export default StudentsPage;
