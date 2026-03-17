import { z } from 'zod';

export const WithdrawalSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export type WithdrawalFormType = z.infer<typeof WithdrawalSchema>;
