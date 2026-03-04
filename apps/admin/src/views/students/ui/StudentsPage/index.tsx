'use client';

import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useURLFilters } from '@repo/shared/hooks';
import { Student, StudentRole, StudentSex } from '@repo/shared/types';
import { Card, CardContent, CardHeader, CardTitle, CommonPagination } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useForm, useWatch } from 'react-hook-form';

import { StudentFilterSchema, StudentFilterType } from '@/entities/student';
import { useGetClubs } from '@/views/clubs';
import { useGetStudents } from '@/views/students';
import {
  StudentExcelActions,
  StudentFilter,
  StudentFormDialog,
  StudentList,
} from '@/widgets/students';

const PAGE_SIZE = 10;

const StudentsPage = () => {
  const searchParams = useSearchParams();
  const { updateURL } = useURLFilters<StudentFilterType>();

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const initialValues = useMemo(
    (): StudentFilterType & { page: number } => ({
      grade: searchParams.get('grade') || 'all',
      classNum: searchParams.get('classNum') || 'all',
      sex: searchParams.get('sex') || 'all',
      role: searchParams.get('role') || 'all',
      status: searchParams.get('status') || 'all',
      includeGraduates: searchParams.get('includeGraduates') === 'true',
      page: Number(searchParams.get('page')) || 0,
    }),
    [searchParams],
  );

  const form = useForm<StudentFilterType>({
    resolver: zodResolver(StudentFilterSchema),
    defaultValues: {
      grade: initialValues.grade,
      classNum: initialValues.classNum,
      sex: initialValues.sex,
      role: initialValues.role,
      status: initialValues.status,
      includeGraduates: initialValues.includeGraduates,
    },
  });

  const { control } = form;

  const filters = useWatch({
    control,
  });

  const currentPage = initialValues.page;

  useEffect(() => {
    const hasChanged =
      filters.grade !== initialValues.grade ||
      filters.classNum !== initialValues.classNum ||
      filters.sex !== initialValues.sex ||
      filters.role !== initialValues.role ||
      filters.status !== initialValues.status ||
      filters.includeGraduates !== initialValues.includeGraduates;

    if (hasChanged) {
      updateURL(filters, 0);
    }
  }, [
    filters.grade,
    filters.classNum,
    filters.sex,
    filters.role,
    filters.status,
    filters.includeGraduates,
    initialValues.grade,
    initialValues.classNum,
    initialValues.sex,
    initialValues.role,
    initialValues.status,
    initialValues.includeGraduates,
    updateURL,
    filters,
  ]);

  const handlePageChange = (page: number) => {
    updateURL(filters, page);
  };

  const queryParams = {
    page: currentPage,
    size: PAGE_SIZE,
    grade: filters.grade !== 'all' ? Number(filters.grade) : undefined,
    classNum: filters.classNum !== 'all' ? Number(filters.classNum) : undefined,
    sex: filters.sex !== 'all' ? (filters.sex as StudentSex) : undefined,
    role:
      filters.status === 'WITHDRAWN'
        ? ('WITHDRAWN' as StudentRole)
        : filters.status === 'GRADUATE'
          ? ('GRADUATE' as StudentRole)
          : filters.role !== 'all'
            ? (filters.role as StudentRole)
            : undefined,
    includeGraduates: filters.includeGraduates,
  };

  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudents(queryParams);

  const { data: clubsData, isLoading: isLoadingClubs } = useGetClubs({});

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
                <StudentFormDialog
                  mode="create"
                  clubs={clubsData?.data}
                  isLoadingClubs={isLoadingClubs}
                />
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
              <CommonPagination
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
            clubs={clubsData?.data}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            isLoadingClubs={isLoadingClubs}
          />
        )}
      </main>
    </div>
  );
};

export default StudentsPage;
