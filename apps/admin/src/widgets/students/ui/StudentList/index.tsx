import {
  Badge,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/ui';
import { Check, Pencil, X } from 'lucide-react';

import {
  Student,
  getMajorLabel,
  getRoleBadgeVariant,
  getRoleLabel,
  getSexLabel,
} from '@/entities/student';

interface StudentListProps {
  students?: Student[];
  isLoading?: boolean;
}

const StudentList = ({ students, isLoading }: StudentListProps) => {
  return (
    <div className="overflow-x-auto rounded-md border">
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
            <TableHead>취업동아리</TableHead>
            <TableHead>자율동아리</TableHead>
            <TableHead>재학 여부</TableHead>
            <TableHead className="w-20">수정</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
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
                    <Badge variant={getRoleBadgeVariant(student.role)}>
                      {getRoleLabel(student.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.dormitoryRoom}호</TableCell>
                  {/* <TableCell>{student.majorClub.name}</TableCell>
                  <TableCell>{student.jobClub.name}</TableCell>
                  <TableCell>{student.autonomousClub.name}</TableCell> */}
                  <TableCell>
                    {student.isLeaveSchool ? (
                      <X className="bg h-4 w-4 text-red-500" />
                    ) : (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>

                  <TableCell>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentList;
