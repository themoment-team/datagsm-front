import { ApiResponse } from '@repo/shared/types';

export interface ApiKeyData {
  apiKey: string;
  expiresAt: string;
  scopes: string[];
  description: string;
}
export type ApiKeyResponse = ApiResponse<ApiKeyData>;

export interface AvailableScopeData {
  scope: string;
  description: string;
}

export interface AvailableScopeGroupData {
  title: string;
  scopes: AvailableScopeData[];
}

export type AvailableScopeListResponse = ApiResponse<{
  data: AvailableScopeGroupData[];
}>;
