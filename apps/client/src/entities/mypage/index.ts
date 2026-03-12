import { ApiResponse, Student } from '@repo/shared/types';
import { z } from 'zod';

export interface MyAccount {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN' | 'ROOT';
  isStudent: boolean;
  student?: Student;
}

export type MyAccountResponse = ApiResponse<MyAccount>;

export const WithdrawalSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export type WithdrawalFormType = z.infer<typeof WithdrawalSchema>;
