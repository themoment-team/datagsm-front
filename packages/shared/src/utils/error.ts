import { AxiosError } from 'axios';

export const getApiErrorCode = (error: unknown): number | undefined => {
  if (error instanceof AxiosError) {
    return (error.response?.data as { code?: number })?.code;
  }
  return undefined;
};
