import { z } from 'zod';

export const SignUpFormSchema = z.object({
  email: z
    .email({ message: '올바른 이메일 형식이 아닙니다.' })
    .min(1, { message: '이메일을 입력해주세요.' })
    .refine((email) => email.endsWith('@gsm.hs.kr'), {
      message: '@gsm.hs.kr 도메인 계정만 사용 가능합니다.',
    }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
      message: '비밀번호는 영문과 숫자를 포함해야 합니다.',
    }),
  code: z
    .string()
    .min(1, { message: '인증 코드를 입력해주세요.' })
    .length(8, { message: '인증 코드는 8자리입니다.' }),
});

export type SignUpFormType = z.infer<typeof SignUpFormSchema>;
