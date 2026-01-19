import { z } from 'zod';

import { ApiResponse } from './base';

interface SignInResponseData {
  accessToken: string;
  refreshToken: string;
}

export type SignInResponse = ApiResponse<SignInResponseData>;

export const SignInFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해주세요.' })
    .refine((email) => email.endsWith('@gsm.hs.kr'), {
      message: '@gsm.hs.kr 도메인 계정만 사용 가능합니다.',
    }),
  password: z
    .string()
    .min(1, { message: '비밀번호를 입력해주세요.' })
    .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
      message: '비밀번호는 영문과 숫자를 포함해야 합니다.',
    }),
});

export type SignInFormType = z.infer<typeof SignInFormSchema>;

export interface OAuthCodeRequest {
  email: string;
  password: string;
  clientId: string;
  redirectUrl: string;
}

interface OAuthCodeResponseData {
  code: string;
}

export type OAuthCodeResponse = ApiResponse<OAuthCodeResponseData>;
