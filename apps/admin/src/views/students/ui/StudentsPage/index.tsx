'use client';

import { useState } from 'react';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Download, Upload } from 'lucide-react';

import { Student } from '@/entities/student';
import {
  AddStudentDialog,
  StudentFilter,
  StudentList,
  StudentPagination,
} from '@/widgets/students';

const demoStudents: Student[] = [
  {
    studentId: 1,
    name: '김철수',
    sex: 'MAN',
    email: 'chulsoo@gsm.hs.kr',
    grade: 1,
    classNum: 1,
    number: 1,
    studentNumber: 1101,
    major: 'SW',
    role: 'GENERAL_STUDENT',
    dormitoryFloor: 3,
    dormitoryRoom: 301,
    isLeaveSchool: false,
  },
];

const StudentsPage = () => {
  const [students] = useState(demoStudents);
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [majorFilter, setMajorFilter] = useState<string>('all');

  const filteredStudents = students.filter((student) => {
    if (gradeFilter !== 'all' && student.grade !== Number.parseInt(gradeFilter)) return false;
    if (majorFilter !== 'all' && student.major !== majorFilter) return false;
    return true;
  });

  return (
    <div className={cn('bg-background h-[calc(100vh-4.0625rem)]')}>
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">학생 관리</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Excel 다운로드
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Excel 업로드
                </Button>
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
              <StudentList students={filteredStudents} />
              <StudentPagination />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentsPage;
