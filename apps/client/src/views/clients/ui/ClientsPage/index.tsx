'use client';

import { useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { useURLFilters } from '@repo/shared/hooks';
import { Card, CardContent, CardHeader, CardTitle, CommonPagination } from '@repo/shared/ui';
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

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [createdClient, setCreatedClient] = useState<CreateClientData | null>(null);

  const handleCopyClientId = (clientId: string) => {
    navigator.clipboard.writeText(clientId);
    setCopiedId(clientId);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
    <div className={cn('bg-background h-[calc(100vh-4.0625rem)]')}>
      <main className={cn('container mx-auto px-4 py-8')}>
        <Card>
          <CardHeader>
            <div className={cn('flex items-center justify-between')}>
              <CardTitle className={cn('text-2xl')}>OAuth 클라이언트 관리</CardTitle>
              <ClientFormDialog
                mode="create"
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onCreateSuccess={handleCreateSuccess}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ClientList
              clients={clients}
              isLoading={isLoading}
              copiedId={copiedId}
              onCopyClientId={handleCopyClientId}
              onEdit={handleEdit}
            />

            {/* Pagination */}
            <div className={cn('mt-4')}>
              <CommonPagination
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </CardContent>
        </Card>

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
      </main>
    </div>
  );
};

export default ClientsPage;
