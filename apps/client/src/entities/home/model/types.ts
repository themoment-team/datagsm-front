import { ApiResponse } from '@repo/shared/types';

export interface ApiKeyData {
  apiKey: string;
  expiresAt: string;
  scopes: string[];
  description: string;
}
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
