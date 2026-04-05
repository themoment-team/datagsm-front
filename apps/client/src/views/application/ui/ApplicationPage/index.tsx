'use client';

import { useState } from 'react';

import { CommonPagination, PageHeader } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

import { Application } from '@/entities/application';
import { useGetMy } from '@/shared/hooks';
import { ApplicationFormDialog, ApplicationList } from '@/widgets/application';

import { useGetApplications } from '../../model/useGetApplications';

const PAGE_SIZE = 10;

const ApplicationPage = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: myData } = useGetMy();
  const { data: applicationsData, isLoading } = useGetApplications({
    page: currentPage,
    size: PAGE_SIZE,
  });

  const handleEdit = (application: Application) => {
    setEditingApplication(application);
    setIsEditDialogOpen(true);
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
          breadcrumb="DATAGSM / APPLICANTION"
          title="애플리케이션"
          action={<ApplicationFormDialog mode="create" />}
        />

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
        <div className={cn('mt-8 flex justify-center')}>
          <CommonPagination
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={applicationsData?.data.totalPages ?? 0}
            onPageChange={setCurrentPage}
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
