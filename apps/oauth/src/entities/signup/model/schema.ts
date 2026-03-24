import { z } from 'zod';

export const SignUpFormSchema = z
  .object({
    email: z.string().min(1, { message: '이메일을 입력해주세요.' }),
    password: z
      .string()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
      .max(100, { message: '비밀번호는 최대 100자 이하여야 합니다.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
        message: '비밀번호는 영문과 숫자를 포함해야 합니다.',
      }),
    confirmPassword: z.string().min(1, { message: '비밀번호 확인을 입력해주세요.' }),
    code: z
      .string()
      .min(1, { message: '인증 코드를 입력해주세요.' })
      .length(8, { message: '인증 코드는 8자리입니다.' }),
    privacyAgreed: z.boolean().refine((val) => val === true, {
      message: '개인정보 처리방침에 동의해주세요.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignUpFormType = z.infer<typeof SignUpFormSchema>;
export type SignUpRequestType = Omit<SignUpFormType, 'privacyAgreed' | 'confirmPassword'>;
