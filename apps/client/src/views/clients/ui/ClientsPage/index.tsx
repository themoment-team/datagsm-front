'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CommonPagination } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

import { Client, CreatedClient } from '@/entities/clients';
import ClientFormDialog from '@/widgets/clients/ui/ClientFormDialog';
import ClientList from '@/widgets/clients/ui/ClientList';
import ClientSuccessDialog from '@/widgets/clients/ui/ClientSuccessDialog';

// Demo data
const demoClients: Client[] = [
  {
    id: 1,
    name: 'GSM 포털',
    clientId: 'gsm_client_a1b2c3d4e5f6g7h8',
    redirectUrls: ['https://portal.gsm.hs.kr/callback', 'https://portal.gsm.hs.kr/auth/callback'],
    scopes: ['student:read', 'club:read', 'neis:read'],
  },
  {
    id: 2,
    name: '학사 관리 시스템',
    clientId: 'gsm_client_i9j0k1l2m3n4o5p6',
    redirectUrls: ['https://admin.gsm.hs.kr/oauth/callback'],
    scopes: ['student:*', 'club:*'],
  },
  {
    id: 3,
    name: '모바일 앱',
    clientId: 'gsm_client_q7r8s9t0u1v2w3x4',
    redirectUrls: ['gsm-app://callback', 'https://app.gsm.hs.kr/auth'],
    scopes: ['student:read', 'neis:read'],
  },
  {
    id: 4,
    name: '동아리 관리',
    clientId: 'gsm_client_y5z6a7b8c9d0e1f2',
    redirectUrls: ['https://club.gsm.hs.kr/oauth/redirect'],
    scopes: ['club:read', 'project:read'],
  },
];

const ClientsPage = () => {
  const [clients] = useState<Client[]>(demoClients);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [createdClient, setCreatedClient] = useState<CreatedClient | null>(null);

  const handleCopyClientId = (clientId: string) => {
    navigator.clipboard.writeText(clientId);
    setCopiedId(clientId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (clientId: number) => {
    // TODO: API 연결
    console.log('Delete client:', clientId);
  };

  const handleCreateClient = (data: { name: string; redirectUrls: string[]; scopes: string[] }) => {
    // Simulate server response with generated client ID and secret
    const newClientId = `gsm_client_${Math.random().toString(36).substring(2, 18)}`;
    const newClientSecret = `gsm_secret_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    setCreatedClient({
      name: data.name,
      clientId: newClientId,
      clientSecret: newClientSecret,
    });

    setIsSuccessDialogOpen(true);
  };

  const handleUpdateClient = (data: { name: string; redirectUrls: string[]; scopes: string[] }) => {
    // TODO: API 연결
    console.log('Update client:', editingClient?.id, data);
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
                onSubmit={handleCreateClient}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ClientList
              clients={clients}
              copiedId={copiedId}
              onCopyClientId={handleCopyClientId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            <div className={cn('mt-4')}>
              <CommonPagination
                isLoading={false}
                currentPage={currentPage}
                totalPages={Math.ceil(clients.length / 10)}
                onPageChange={setCurrentPage}
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
          onSubmit={handleUpdateClient}
        />
      </main>
    </div>
  );
};

export default ClientsPage;
