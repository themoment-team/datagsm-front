import { ApiResponse, Club, ClubMember } from '@repo/shared/types';

export interface Project {
  id: number;
  name: string;
  description: string;
  club: Club;
  participants: ClubMember[];
}

export interface ProjectListData {
  totalPages: number;
  totalElements: number;
  projects: Project[];
}

export type ProjectListResponse = ApiResponse<ProjectListData>;

export interface ProjectQueryParams {
  projectId?: number;
  projectName?: string;
  clubId?: number;
  page: number;
  size: number;
}
