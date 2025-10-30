import { ApiResponse } from './base';

interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
