'use client';

import { useCopyToClipboard } from '@repo/shared/hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Copy, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';



import { Client } from '@/entities/clients';
import { useDeleteClient } from '@/widgets/clients';





interface ClientListProps {
  clients?: Client[];
  isLoading?: boolean;
  onEdit: (client: Client) => void;
}

interface ClientListItemProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientListItem = ({ client, onEdit, onDelete }: ClientListItemProps) => {
  const { copied, copy } = useCopyToClipboard({
    successMessage: '클라이언트 ID가 복사되었습니다.',
  });

  return (
    <TableRow>
      <TableCell className={cn('font-medium')}>{client.clientName}</TableCell>
      <TableCell className={cn('text-muted-foreground')}>{client.serviceName}</TableCell>
      <TableCell>
        <div className={cn('flex items-center gap-2')}>
          <code className={cn('bg-muted px-2 py-1 text-xs font-mono')}>
            {client.id}
          </code>
          <button
            className={cn(
              'flex h-6 w-6 cursor-pointer items-center justify-center border border-foreground/35 transition-all hover:border-foreground hover:bg-foreground hover:text-background',
            )}
            onClick={() => copy(client.id)}
          >
            {copied ? <Check className={cn('h-3 w-3')} /> : <Copy className={cn('h-3 w-3')} />}
          </button>
        </div>
      </TableCell>
      <TableCell>
        <div className={cn('flex flex-wrap gap-1')}>
          {client.redirectUrl.map((url, index) => (
            <span
              key={index}
              className={cn('border border-foreground/25 px-1.5 py-0.5 text-xs text-muted-foreground font-mono')}
            >
              {url}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className={cn('flex flex-wrap gap-1')}>
          {client.scopes.map((scope, index) => (
            <span
              key={index}
              className={cn('bg-foreground px-1.5 py-0.5 text-xs uppercase text-background font-mono')}
            >
              {scope}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className={cn('flex items-center gap-1')}>
          <button
            className={cn(
              'flex h-7 w-7 cursor-pointer items-center justify-center border border-foreground/30 transition-all hover:border-foreground hover:bg-foreground hover:text-background',
            )}
            onClick={() => onEdit(client)}
          >
            <Pencil className={cn('h-3.5 w-3.5')} />
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className={cn(
                  'flex h-7 w-7 cursor-pointer items-center justify-center border border-destructive/35 text-destructive transition-all hover:bg-destructive hover:text-white',
                )}
              >
                <Trash2 className={cn('h-3.5 w-3.5')} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className={cn('border-2 border-foreground pixel-shadow')}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="font-pixel text-[12px] leading-[1.8]">
                  클라이언트 삭제
                </AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 &apos;{client.clientName}&apos; 클라이언트를 삭제하시겠습니까? 이 작업은
                  되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(client.id)}
                  className={cn(
                    'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
                  )}
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

const ClientList = ({ clients, isLoading, onEdit }: ClientListProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteClient } = useDeleteClient({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('클라이언트가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('클라이언트 삭제에 실패했습니다.');
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>클라이언트 이름</TableHead>
          <TableHead>서비스 명칭</TableHead>
          <TableHead>클라이언트 ID</TableHead>
          <TableHead>리다이렉트 URL</TableHead>
          <TableHead>권한 범위</TableHead>
          <TableHead className={cn('w-24')}>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className={cn('h-4 w-32')} /></TableCell>
              <TableCell><Skeleton className={cn('h-4 w-24')} /></TableCell>
              <TableCell><Skeleton className={cn('h-6 w-48')} /></TableCell>
              <TableCell><Skeleton className={cn('h-4 w-60')} /></TableCell>
              <TableCell><Skeleton className={cn('h-4 w-24')} /></TableCell>
              <TableCell><Skeleton className={cn('h-7 w-16')} /></TableCell>
            </TableRow>
          ))
        ) : clients && clients.length > 0 ? (
          clients.map((client) => (
            <ClientListItem
              key={client.id}
              client={client}
              onEdit={onEdit}
              onDelete={(id) => deleteClient(id)}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className={cn('h-24 text-center text-muted-foreground font-mono')}>
              {'>'} 등록된 클라이언트가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ClientList;
