'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClubListResponse, StudentRole, StudentSex } from '@repo/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useForm, useWatch } from 'react-hook-form';

import { StudentFilterSchema, StudentFilterType } from '@/entities/student';
import { useGetStudents } from '@/views/students';
import {
  AddStudentDialog,
  StudentExcelActions,
  StudentFilter,
  StudentList,
  StudentPagination,
} from '@/widgets/students';

const PAGE_SIZE = 10;

interface StudentsPageProps {
  initialClubsData?: ClubListResponse;
}

const StudentsPage = ({ initialClubsData }: StudentsPageProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const form = useForm<StudentFilterType>({
    resolver: zodResolver(StudentFilterSchema),
    defaultValues: {
      grade: 'all',
      classNum: 'all',
      sex: 'all',
      role: 'all',
      status: 'all',
    },
  });

  const { control } = form;

  const filters = useWatch({
    control,
  });

  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudents({
    page: currentPage,
    size: PAGE_SIZE,
    grade: filters.grade !== 'all' ? Number.parseInt(filters.grade as string) : undefined,
    classNum: filters.classNum !== 'all' ? Number.parseInt(filters.classNum as string) : undefined,
    sex: filters.sex !== 'all' ? (filters.sex as StudentSex) : undefined,
    role: filters.role !== 'all' ? (filters.role as StudentRole) : undefined,
    isLeaveSchool: filters.status !== 'all' ? filters.status === 'true' : undefined,
  });

  const filteredStudents = studentsData?.data.students;

  const totalPages = studentsData?.data.totalPages ?? 0;

  return (
    <div className={cn('bg-background h-[calc(100vh-4.0625rem)]')}>
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">학생 관리</CardTitle>
              <div className="flex items-center gap-2">
                <StudentExcelActions />
                <AddStudentDialog clubs={initialClubsData?.data} />
              </div>
            </div>

            <StudentFilter control={control} />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StudentList students={filteredStudents} isLoading={isLoadingStudents} />
              <StudentPagination
                isLoading={isLoadingStudents}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentsPage;
