'use client';

import { useState } from 'react';

import { PageHeader } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

import { Application } from '@/entities/application';
import { ApplicationFormDialog, ApplicationList } from '@/widgets/application';

const ApplicationPage = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);

  const handleEdit = (application: Application) => {
    setEditingApplication(application);
    setIsEditDialogOpen(true);
  };

  const applications: Application[] = [];
  const isLoading = false;

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
          <ApplicationList applications={applications} isLoading={isLoading} onEdit={handleEdit} />
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
