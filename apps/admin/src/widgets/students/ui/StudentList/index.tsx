import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/ui';
import { Pencil } from 'lucide-react';

import {
  Student,
  getMajorLabel,
  getRoleBadgeVariant,
  getRoleLabel,
  getSexLabel,
} from '@/entities/student';

interface StudentListProps {
  students?: Student[];
}

const StudentList = ({ students }: StudentListProps) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>학번</TableHead>
            <TableHead>학과</TableHead>
            <TableHead>성별</TableHead>
            <TableHead>기숙사</TableHead>
            <TableHead>구분</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead className="w-20">수정</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.studentNumber}</TableCell>
              <TableCell>{getMajorLabel(student.major)}</TableCell>
              <TableCell>{getSexLabel(student.sex)}</TableCell>
              <TableCell>{student.dormitoryRoom}호</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(student.role)}>
                  {getRoleLabel(student.role)}
                </Badge>
              </TableCell>
              <TableCell>{student.email}</TableCell>
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
