'use client';

import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { useURLFilters } from '@repo/shared/hooks';
import { CommonPagination, PageHeader } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useForm, useWatch } from 'react-hook-form';

import { Application } from '@/entities/application';
import { useGetMy } from '@/shared/hooks';
import { ApplicationFilter, ApplicationFormDialog, ApplicationList } from '@/widgets/application';
import { ApplicationFilterValues } from '@/widgets/application/ui/ApplicationFilter';

import { useGetApplications } from '../../model/useGetApplications';

const PAGE_SIZE = 10;

const ApplicationPage = () => {
  const searchParams = useSearchParams();
  const { updateURL } = useURLFilters<ApplicationFilterValues>();

  const initialValues = useMemo(
    () => ({
      name: searchParams.get('name') || 'all',
      page: Number(searchParams.get('page')) || 0,
    }),
    [searchParams],
  );

  const form = useForm<ApplicationFilterValues>({
    defaultValues: {
      name: initialValues.name,
    },
  });

  const { control } = form;
  const filters = useWatch({ control });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);

  const currentPage = initialValues.page;

  useEffect(() => {
    if (filters.name !== initialValues.name) {
      updateURL(
        {
          name: filters.name,
        },
        0,
      );
    }
  }, [filters.name, initialValues.name, updateURL]);

  const { data: myData } = useGetMy();

  const { data: applicationsData, isLoading } = useGetApplications({
    page: currentPage,
    size: PAGE_SIZE,
    name: initialValues.name !== 'all' ? initialValues.name : undefined,
  });

  const { data: allApplicationsData, isLoading: isLoadingAll } = useGetApplications({
    page: 0,
    size: 100,
  });

  const applicationNames = useMemo(() => {
    const apps = allApplicationsData?.data.applications || [];
    const names = apps.map((app) => app.name);
    return Array.from(new Set(names));
  }, [allApplicationsData]);

  const handleEdit = (application: Application) => {
    setEditingApplication(application);
    setIsEditDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    updateURL(
      {
        name: filters.name,
      },
      page,
    );
  };

  const applications =
    applicationsData?.data.applications.map((app) => ({
      id: app.id,
      applicationName: app.name,
      accountId: app.accountId,
      applicationScopes: app.scopes.map((scope) => ({
        scopeId: scope.id,
        applicationScope: scope.scopeName,
        applicationDescription: scope.description,
      })),
    })) ?? [];

  return (
    <div className={cn('bg-background min-h-[calc(100vh-3.5rem)]')}>
      <main className={cn('container mx-auto px-4 py-8')}>
        {/* Page header */}
        <PageHeader
          breadcrumb="DATAGSM / APPLICATION"
          title="애플리케이션"
          action={<ApplicationFormDialog mode="create" />}
        />

        {/* Filter */}
        <div className={cn('mb-6')}>
          <ApplicationFilter
            control={control}
            applicationNames={applicationNames}
            isLoading={isLoadingAll}
          />
        </div>

        {/* Table */}
        <div className={cn('border-foreground pixel-shadow border-2')}>
          <ApplicationList
            applications={applications}
            isLoading={isLoading}
            onEdit={handleEdit}
            myId={myData?.data.id}
          />
        </div>

        {/* Pagination */}
        <div className={cn('mt-8')}>
          <CommonPagination
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={applicationsData?.data.totalPages ?? 0}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <ApplicationFormDialog
        mode="edit"
        application={editingApplication ?? undefined}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default ApplicationPage;
