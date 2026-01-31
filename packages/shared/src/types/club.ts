import { ApiResponse, StudentMajor, StudentSex } from '@repo/shared/types';

export type ClubType = 'MAJOR_CLUB' | 'JOB_CLUB' | 'AUTONOMOUS_CLUB';

export interface ClubMember {
  id: number;
  name: string;
  email: string;
  studentNumber: number;
  major: StudentMajor;
  sex: StudentSex;
}

export interface Club {
  id: number;
  name: string;
  type: ClubType;
  leader: ClubMember;
  participants: ClubMember[];
}

export interface ClubListData {
  totalPages: number;
  totalElements: number;
  clubs: Club[];
}

export type ClubListResponse = ApiResponse<ClubListData>;
