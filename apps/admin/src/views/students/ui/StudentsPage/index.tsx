'use client';

import { useState } from 'react';

import { StudentListResponse, StudentRole, StudentSex } from '@repo/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

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
  initialStudentsData?: StudentListResponse;
}

const StudentsPage = ({ initialStudentsData }: StudentsPageProps) => {
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [classNumFilter, setClassNumFilter] = useState<string>('all');
  const [sexFilter, setSexFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('false');
  const [currentPage, setCurrentPage] = useState(0);

  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudents(
    {
      page: currentPage,
      size: PAGE_SIZE,
      grade: gradeFilter !== 'all' ? Number.parseInt(gradeFilter) : undefined,
      classNum: classNumFilter !== 'all' ? Number.parseInt(classNumFilter) : undefined,
      sex: sexFilter !== 'all' ? (sexFilter as StudentSex) : undefined,
      role: roleFilter !== 'all' ? (roleFilter as StudentRole) : undefined,
      isLeaveSchool: statusFilter !== 'all' ? statusFilter === 'true' : undefined,
    },
    {
      initialData: initialStudentsData,
    },
  );

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
                <AddStudentDialog />
              </div>
            </div>

            <StudentFilter
              gradeFilter={gradeFilter}
              setGradeFilter={setGradeFilter}
              classNumFilter={classNumFilter}
              setClassNumFilter={setClassNumFilter}
              sexFilter={sexFilter}
              setSexFilter={setSexFilter}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
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
