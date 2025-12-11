import { ApiResponse } from '@repo/shared/types';

export type ClubType = 'MAJOR' | 'JOB' | 'AUTONOMOUS';

export interface Club {
  id: number;
  name: string;
  type: ClubType;
}

export interface ClubListData {
  totalPages: number;
  totalElements: number;
  clubs: Club[];
}

export type ClubListResponse = ApiResponse<ClubListData>;
