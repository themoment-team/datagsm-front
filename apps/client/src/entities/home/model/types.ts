import { ApiResponse } from '@repo/shared/types';
import z from 'zod';

export interface ApiKeyData {
  apiKey: string;
  expiresAt: string;
  scopes: string[];
  description: string;
}

export const ApiKeySchema = z.object({
  scopes: z.array(z.string()).min(1, { message: '권한 범위를 최소 1개 이상 선택해주세요.' }), // 추후 수정
  description: z.string().min(1, { message: '설명을 입력해주세요.' }),
});

export type CreateApiKeyType = z.infer<typeof ApiKeySchema>;

export type UpdateAPiKeyType = z.infer<typeof ApiKeySchema>;

export interface AvailableScopeData {
  scope: string;
  description: string;
}

export interface AvailableScopeResponse {
  title: string;
  scopes: AvailableScopeData[];
}

export type getAvailableScopeResponse = ApiResponse<{
  data: AvailableScopeResponse[];
}>;
export type ApiKeyResponse = ApiResponse<ApiKeyData>;
