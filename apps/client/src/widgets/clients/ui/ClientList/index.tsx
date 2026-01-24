'use client';

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
  Badge,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Check, Copy, Pencil, Trash2 } from 'lucide-react';

import { Client } from '@/entities/clients';

interface ClientListProps {
  clients?: Client[];
  isLoading?: boolean;
  copiedId: string | null;
  onCopyClientId: (clientId: string) => void;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientList = ({
  clients,
  isLoading,
  copiedId,
  onCopyClientId,
  onEdit,
  onDelete,
}: ClientListProps) => {
  return (
    <div className={cn('rounded-md border')}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>클라이언트 이름</TableHead>
            <TableHead>클라이언트 ID</TableHead>
            <TableHead>리다이렉트 URL</TableHead>
            <TableHead>권한</TableHead>
            <TableHead className={cn('w-[100px]')}>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className={cn('h-4 w-32')} />
                </TableCell>
                <TableCell>
                  <Skeleton className={cn('h-6 w-48')} />
                </TableCell>
                <TableCell>
                  <Skeleton className={cn('h-4 w-60')} />
                </TableCell>
                <TableCell>
                  <Skeleton className={cn('h-4 w-24')} />
                </TableCell>
                <TableCell>
                  <Skeleton className={cn('h-8 w-16')} />
                </TableCell>
              </TableRow>
            ))
          ) : clients && clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className={cn('font-medium')}>{client.name}</TableCell>
                <TableCell>
                  <div className={cn('flex items-center gap-2')}>
                    <code className={cn('bg-muted rounded px-2 py-1 font-mono text-xs')}>
                      {client.id}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn('h-6 w-6')}
                      onClick={() => onCopyClientId(client.id)}
                    >
                      {copiedId === client.id ? (
                        <Check className={cn('h-3 w-3 text-green-500')} />
                      ) : (
                        <Copy className={cn('h-3 w-3')} />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn('flex flex-wrap gap-1')}>
                    {client.redirectUrl.map((url, index) => (
                      <Badge key={index} variant="secondary" className={cn('font-mono text-xs')}>
                        {url}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn('flex flex-wrap gap-1')}>
                    {client.scopes.map((scope, index) => (
                      <Badge key={index} variant="outline" className={cn('text-xs')}>
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn('flex items-center gap-1')}>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(client)}>
                      <Pencil className={cn('h-4 w-4')} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="삭제">
                          <Trash2 className={cn('text-destructive h-4 w-4')} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>클라이언트 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            정말로 '{client.name}' 클라이언트를 삭제하시겠습니까? 이 작업은 되돌릴
                            수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(client.id)}
                            className={cn('bg-destructive text-destructive-foreground')}
                          >
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className={cn('h-24 text-center')}>
                등록된 클라이언트가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientList;
