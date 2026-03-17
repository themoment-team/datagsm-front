'use client';

import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce, useURLFilters } from '@repo/shared/hooks';
import { Project } from '@repo/shared/types';
import { CommonPagination } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

const pixelStyle = { fontFamily: '"Press Start 2P", monospace' };
const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };
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
import { useGetStudents } from '@/views/students';
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

  const debouncedProjectName = useDebounce(filters.projectName);

  const currentPage = initialValues.page;

  useEffect(() => {
    const hasChanged =
      debouncedProjectName !== initialValues.projectName || filters.clubId !== initialValues.clubId;

    if (hasChanged) {
      updateURL(
        {
          projectName: debouncedProjectName,
          clubId: filters.clubId,
        },
        0,
      );
    }
  }, [debouncedProjectName, filters.clubId, initialValues, updateURL]);

  const handlePageChange = (page: number) => {
    updateURL(
      {
        projectName: debouncedProjectName,
        clubId: filters.clubId,
      },
      page,
    );
  };

  const queryParams = {
    page: currentPage,
    size: PAGE_SIZE,
    projectName: debouncedProjectName || undefined,
    clubId: filters.clubId,
  };

  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjects(queryParams);
  const { data: clubsData } = useGetClubs({ size: 100, clubType: 'MAJOR_CLUB' });
  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudents(
    {},
    {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 30,
    },
  );

  const projectList = projectsData?.data.projects || [];
  const totalPages = projectsData?.data.totalPages || 0;
  const clubs = clubsData?.data.clubs || [];

  const projectForm = useForm<AddProjectType>({
    resolver: zodResolver(AddProjectSchema),
  });

  return (
    <div className={cn('bg-background min-h-[calc(100vh-3.5rem)]')}>
      <main className={cn('container mx-auto px-4 py-8')}>
        {/* Page header */}
        <div className={cn('mb-6 flex items-end justify-between border-b-2 border-foreground pb-4')}>
          <div>
            <p className={cn('mb-2 text-xs uppercase tracking-widest text-muted-foreground')} style={monoStyle}>
              DATAGSM / Admin
            </p>
            <h1 className={cn('text-foreground leading-tight')} style={{ ...pixelStyle, fontSize: '15px' }}>
              프로젝트 관리
            </h1>
          </div>
          <ProjectFormDialog
            mode="create"
            form={projectForm}
            clubs={clubs}
            students={studentsData?.data.students}
            isLoadingStudents={isLoadingStudents}
          />
        </div>

        {/* Filters */}
        <div className={cn('mb-4')}>
          <ProjectFilter register={register} control={control} clubs={clubs} />
        </div>

        {/* Table */}
        <div className={cn('border-2 border-foreground')} style={{ boxShadow: '4px 4px 0 0 oklch(0.04 0 0)' }}>
          <ProjectList
            projects={projectList}
            isLoading={isLoadingProjects}
            onEdit={handleEditProject}
            onDelete={(projectId) => deleteProject(projectId)}
          />
        </div>

        <div className={cn('mt-5')}>
          <CommonPagination
            isLoading={isLoadingProjects}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {editingProject && (
          <ProjectFormDialog
            mode="edit"
            project={editingProject}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            form={projectForm}
            clubs={clubs}
            students={studentsData?.data.students}
            isLoadingStudents={isLoadingStudents}
          />
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
