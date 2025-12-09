'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

import { students } from '@/entities/student';
import { useGetStudents } from '@/views/students';
import {
  AddStudentDialog,
  StudentExcelActions,
  StudentFilter,
  StudentList,
  StudentPagination,
} from '@/widgets/students';

const PAGE_SIZE = 10;

const StudentsPage = () => {
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [majorFilter, setMajorFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);

  // Mock 데이터 페이지네이션
  const paginatedStudents = students.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudents(
    {
      page: currentPage,
      size: PAGE_SIZE,
    },
    {
      initialData: {
        status: 'OK',
        code: 200,
        message: 'OK',
        data: {
          totalPages: Math.ceil(students.length / PAGE_SIZE),
          totalElements: students.length,
          students: paginatedStudents,
        },
      },
    },
  );

  const filteredStudents = studentsData?.data.students.filter((student) => {
    if (gradeFilter !== 'all' && student.grade !== Number.parseInt(gradeFilter)) return false;
    if (majorFilter !== 'all' && student.major !== majorFilter) return false;
    return true;
  });

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
                <AddStudentDialog />
              </div>
            </div>

            <StudentFilter
              gradeFilter={gradeFilter}
              setGradeFilter={setGradeFilter}
              majorFilter={majorFilter}
              setMajorFilter={setMajorFilter}
            />
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
