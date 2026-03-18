import { Student } from '@repo/shared/types';
import {
  PixelIconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Pencil } from 'lucide-react';

import { getMajorLabel, getRoleLabel, getSexLabel } from '@/entities/student';

interface StudentListProps {
  students?: Student[];
  isLoading?: boolean;
  onEdit?: (student: Student) => void;
}

const StudentList = ({ students, isLoading, onEdit }: StudentListProps) => {
  return (
    <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>성별</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>학번</TableHead>
            <TableHead>학과</TableHead>
            <TableHead>구분</TableHead>
            <TableHead>기숙사 호실</TableHead>
            <TableHead>전공동아리</TableHead>
            <TableHead>자율동아리</TableHead>
            <TableHead className={cn('w-20')}>수정</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className={cn('h-4 w-16')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-4 w-8')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-4 w-32')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-4 w-16')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-4 w-24')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-5 w-16 rounded-full')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-4 w-12')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-4 w-20')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-4 w-20')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-8 w-8')} />
                  </TableCell>
                </TableRow>
              ))
            : students?.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{getSexLabel(student.sex)}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.studentNumber}</TableCell>
                  <TableCell>{getMajorLabel(student.major)}</TableCell>
                  <TableCell>
                    <span className={cn('border border-foreground/25 px-1.5 py-0.5 text-xs font-mono uppercase')}>
                      {getRoleLabel(student.role)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {student.dormitoryRoom ? `${student.dormitoryRoom}호` : '없음'}
                  </TableCell>
                  <TableCell>{student.majorClub?.name ?? '없음'}</TableCell>
                  <TableCell>{student.autonomousClub?.name ?? '없음'}</TableCell>

                  <TableCell>
                    <PixelIconButton onClick={() => onEdit?.(student)}>
                      <Pencil className={cn('h-3.5 w-3.5')} />
                    </PixelIconButton>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
  );
};

export default StudentList;
