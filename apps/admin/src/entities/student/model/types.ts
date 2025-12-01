import { ApiResponse } from '@repo/shared/types';

export type StudentSex = 'MAN' | 'WOMAN';

export type StudentMajor = 'SW' | 'IOT' | 'AI';

export type StudentRole = 'GENERAL_STUDENT' | 'STUDENT_COUNCIL' | 'DORMITORY_MANAGER';

export interface Student {
  studentId: number;
  name: string;
  sex: StudentSex;
  email: string;
  grade: number;
  classNum: number;
  number: number;
  studentNumber: number;
  major: StudentMajor;
  role: StudentRole;
  dormitoryFloor: number;
  dormitoryRoom: number;
  isLeaveSchool: boolean;
}

export interface StudentListData {
  totalPages: number;
  totalElements: number;
  students: Student[];
}

export type StudentListResponse = ApiResponse<StudentListData>;
