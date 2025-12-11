import { z } from 'zod';

export const StudentFilterSchema = z.object({
  grade: z.string().optional(),
  classNum: z.string().optional(),
  sex: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export type StudentFilterType = z.infer<typeof StudentFilterSchema>;

export const AddStudentSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  sex: z.enum(['MAN', 'WOMAN'], '성별을 선택해주세요.'),
  email: z.email('올바른 이메일 형식이 아닙니다.'),
  grade: z.number('학년을 선택해주세요.'),
  classNum: z.number('반을 선택해주세요.'),
  number: z.number('번호를 선택해주세요.'),
  role: z.enum(['GENERAL_STUDENT', 'STUDENT_COUNCIL', 'DORMITORY_MANAGER'], '구분을 선택해주세요.'),
  dormitoryRoomNumber: z
    .number('호실을 입력해주세요.')
    .min(201, '201호 이상으로 입력해주세요.')
    .max(518, '518호 이하로 입력해주세요.'),
  majorClubId: z.number().min(1).nullable(),
  jobClubId: z.number().min(1).nullable(),
  autonomousClubId: z.number().min(1).nullable(),
});

export type AddStudentType = z.infer<typeof AddStudentSchema>;
