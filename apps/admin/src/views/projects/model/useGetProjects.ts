import { get, projectQueryKeys, projectUrl } from '@repo/shared/api';
import { ProjectListResponse, ProjectQueryParams } from '@repo/shared/types';
import { useQuery } from '@tanstack/react-query';

export const useGetProjects = (params: ProjectQueryParams) =>
  useQuery({
    queryKey: projectQueryKeys.getProjects(params),
    queryFn: () => get<ProjectListResponse>(projectUrl.getProjects(params)),
  });
