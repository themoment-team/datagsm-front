import { useDeleteApiKeyById, useUpdateApiKeyExpirationById } from '@repo/shared/hooks';
import { ApiKey } from '@repo/shared/types';
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
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/ui';
import { cn, formatDate } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKeyListProps {
  apiKeys?: ApiKey[];
  isLoading: boolean;
}

const ApiKeyList = ({ apiKeys, isLoading }: ApiKeyListProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteApiKey } = useDeleteApiKeyById({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'api-keys', 'list'] });
      toast.success('API Key가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('API Key 삭제에 실패했습니다.');
    },
  });

  const { mutate: updateApiKeyExpiration } = useUpdateApiKeyExpirationById({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'api-keys', 'list'] });
      toast.success('API Key 기한이 연장되었습니다.');
    },
    onError: () => {
      toast.error('API Key 기한 연장에 실패했습니다.');
    },
  });

  if (isLoading) {
    return (
      <div className={cn('space-y-2')}>
        <Skeleton className={cn('h-10 w-full')} />
        <Skeleton className={cn('h-24 w-full')} />
        <Skeleton className={cn('h-24 w-full')} />
      </div>
    );
  }

  if (!apiKeys || apiKeys.length === 0) {
    return (
      <div className={cn('text-muted-foreground py-10 text-center')}>
        등록된 API Key가 없습니다.
      </div>
    );
  }

  return (
    <div className={cn('rounded-md border')}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={cn('w-[80px]')}>ID</TableHead>
            <TableHead className={cn('w-[200px]')}>설명</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead className={cn('w-[180px]')}>만료일</TableHead>
            <TableHead className={cn('w-[100px]')}>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell className={cn('font-medium')}>{apiKey.id}</TableCell>
              <TableCell className={cn('w-[200px] truncate')} title={apiKey.description}>
                {apiKey.description}
              </TableCell>
              <TableCell className={cn('break-all font-mono text-[11px]')}>
                {apiKey.apiKey}
              </TableCell>
              <TableCell>{formatDate(apiKey.expiresAt)}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <RefreshCw />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Api Key 기한 연장</AlertDialogTitle>
                      <AlertDialogDescription>
                        &apos;{apiKey.description}&apos;의 기한을 연장하시겠습니까?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => updateApiKeyExpiration(apiKey.id)}
                        className={cn('bg-black text-white hover:bg-black/50')}
                      >
                        연장
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn('text-destructive')}>
                      <Trash2 className={cn('h-4 w-4')} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Api Key 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        정말로 &apos;{apiKey.description}&apos;를 삭제하시겠습니까? 이 작업은 되돌릴 수
                        없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteApiKey(apiKey.id)}
                        className={cn('bg-destructive hover:bg-destructive/90 text-white')}
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApiKeyList;
