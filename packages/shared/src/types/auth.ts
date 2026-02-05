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
    .pipe(z.email({ message: '올바른 이메일 형식이 아닙니다.' }))
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

// client_secret은 서버에서만 사용하므로 요청 타입에서 제거
export interface OAuthTokenRequest {
  code: string;
}

interface OAuthTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

export type OAuthTokenResponse = ApiResponse<OAuthTokenResponseData>;

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type RefreshTokenResponse = ApiResponse<OAuthTokenResponseData>;
