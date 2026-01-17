import { z } from 'zod';

import { ApiResponse } from './base';

interface SignInResponseData {
  accessToken: string;
  refreshToken: string;
}

export type SignInResponse = ApiResponse<SignInResponseData>;

export const SignInFormSchema = z.object({
  email: z
    .email({ message: '올바른 이메일 형식이 아닙니다.' })
    .min(1, { message: '이메일을 입력해주세요.' }),
  password: z
    .string()
    .min(1, { message: '비밀번호를 입력해주세요.' })
    .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' }),
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
