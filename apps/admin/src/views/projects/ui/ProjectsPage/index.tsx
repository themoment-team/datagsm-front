'use client';

import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useURLFilters } from '@repo/shared/hooks';
import { Project } from '@repo/shared/types';
import { Card, CardContent, CardHeader, CardTitle, CommonPagination } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import {
  AddProjectSchema,
  AddProjectType,
  ProjectFilterSchema,
  ProjectFilterType,
} from '@/entities/project';
import { useGetClubs } from '@/views/clubs';
import { ProjectFilter, ProjectFormDialog, ProjectList } from '@/widgets/projects';

import { useDeleteProject, useGetProjects } from '../../model';

const PAGE_SIZE = 20;

const ProjectsPage = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { updateURL } = useURLFilters<ProjectFilterType>();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { mutate: deleteProject } = useDeleteProject({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('프로젝트가 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('프로젝트 삭제 실패:', error);
      toast.error('프로젝트 삭제에 실패했습니다.');
    },
  });

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditDialogOpen(true);
  };

  const initialValues = useMemo(
    (): ProjectFilterType & { page: number } => ({
      projectName: searchParams.get('projectName') || '',
      clubId: searchParams.get('clubId') ? Number(searchParams.get('clubId')) : undefined,
      page: Number(searchParams.get('page')) || 0,
    }),
    [searchParams],
  );

  const filterForm = useForm<ProjectFilterType>({
    resolver: zodResolver(ProjectFilterSchema),
    defaultValues: {
      projectName: initialValues.projectName,
      clubId: initialValues.clubId,
    },
  });

  const { register, control } = filterForm;

  const filters = useWatch({
    control,
  });

  const currentPage = initialValues.page;

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasChanged =
        filters.projectName !== initialValues.projectName ||
        filters.clubId !== initialValues.clubId;

      if (hasChanged) {
        updateURL(
          {
            projectName: filters.projectName,
            clubId: filters.clubId,
          },
          0,
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, initialValues, updateURL]);

  const handlePageChange = (page: number) => {
    updateURL(
      {
        projectName: filters.projectName,
        clubId: filters.clubId,
      },
      page,
    );
  };

  const queryParams = {
    page: currentPage,
    size: PAGE_SIZE,
    projectName: filters.projectName || undefined,
    clubId: filters.clubId,
  };

  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjects(queryParams);
  const { data: clubsData } = useGetClubs({ size: 100 });

  const projectList = projectsData?.data.projects || [];
  const totalPages = projectsData?.data.totalPages || 0;
  const clubs = clubsData?.data.clubs || [];

  const projectForm = useForm<AddProjectType>({
    resolver: zodResolver(AddProjectSchema),
  });

  return (
    <div className={cn('bg-background min-h-[calc(100vh-4.0625rem)]')}>
      <main className={cn('container mx-auto px-4 py-8')}>
        <Card>
          <CardHeader>
            <div className={cn('flex items-center justify-between')}>
              <CardTitle className={cn('text-2xl')}>프로젝트 관리</CardTitle>
              <ProjectFormDialog mode="create" form={projectForm} clubs={clubs} />
            </div>

            <ProjectFilter register={register} control={control} clubs={clubs} />
          </CardHeader>
          <CardContent>
            <ProjectList
              projects={projectList}
              isLoading={isLoadingProjects}
              onEdit={handleEditProject}
              onDelete={(projectId) => deleteProject(projectId)}
            />
            <CommonPagination
              isLoading={isLoadingProjects}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>

        {editingProject && (
          <ProjectFormDialog
            mode="edit"
            project={editingProject}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            form={projectForm}
            clubs={clubs}
          />
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
