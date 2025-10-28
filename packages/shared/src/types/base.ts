export interface BaseApiResponse {
  status: string;
  code: number;
  message: string;
}

export interface ApiResponse<T = undefined> extends BaseApiResponse {
  data: T;
}
