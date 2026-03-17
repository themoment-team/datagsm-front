'use client';

import { useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { useURLFilters } from '@repo/shared/hooks';
import { CommonPagination } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

import { Client, CreateClientData } from '@/entities/clients';
import { useGetClients } from '@/views/clients';
import { ClientFormDialog, ClientList, ClientSuccessDialog } from '@/widgets/clients';

const PAGE_SIZE = 10;


const ClientsPage = () => {
  const searchParams = useSearchParams();
  const { updateURL } = useURLFilters<{ page: number }>();

  const initialValues = useMemo(
    () => ({
      page: Number(searchParams.get('page')) || 0,
    }),
    [searchParams],
  );

  const currentPage = initialValues.page;

  const { data: clientsData, isLoading } = useGetClients({
    page: currentPage,
    size: PAGE_SIZE,
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [createdClient, setCreatedClient] = useState<CreateClientData | null>(null);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleCreateSuccess = (data: CreateClientData) => {
    setCreatedClient(data);
    setIsSuccessDialogOpen(true);
  };

  const clients = clientsData?.data.clients || [];
  const totalPages = clientsData?.data.totalPages || 0;

  const handlePageChange = (page: number) => {
    updateURL({}, page);
  };

  return (
    <div className={cn('bg-background min-h-[calc(100vh-3.5rem)]')}>
      <main className={cn('container mx-auto px-4 py-8')}>
        {/* Page header */}
        <div
          className={cn('mb-6 flex items-end justify-between border-b-2 border-foreground pb-4')}
        >
          <div>
            <p
              className={cn('mb-2 text-xs uppercase tracking-widest text-muted-foreground font-mono')}
            >
              DATAGSM / OAuth
            </p>
            <h1
              className={cn('text-foreground leading-tight font-pixel')}
              style={{ fontSize: '15px' }}
            >
              클라이언트
            </h1>
          </div>
          <ClientFormDialog mode="create" onCreateSuccess={handleCreateSuccess} />
        </div>

        {/* Table */}
        <div
          className={cn('border-2 border-foreground pixel-shadow')}
        >
          <ClientList clients={clients} isLoading={isLoading} onEdit={handleEdit} />
        </div>

        {/* Pagination */}
        <div className={cn('mt-5')}>
          <CommonPagination
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <ClientSuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        client={createdClient}
      />

      <ClientFormDialog
        mode="edit"
        client={editingClient ?? undefined}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default ClientsPage;
