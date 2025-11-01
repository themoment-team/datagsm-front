import { ApiResponse } from '@repo/shared/types';

export interface ApiKeyData {
  apiKey: string;
  expiresAt: string;
}

export interface ApiKeyRenewableData {
  renewable: boolean;
}

export type ApiKeyResponse = ApiResponse<ApiKeyData>;

export type ApiKeyRenewableResponse = ApiResponse<ApiKeyRenewableData>;
