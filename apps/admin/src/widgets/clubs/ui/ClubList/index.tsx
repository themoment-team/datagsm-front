import { Club } from '@repo/shared/types';
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
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { getTypeBadgeVariant, getTypeLabel } from '@/entities/club';
import { useDeleteClub } from '@/widgets/clubs';

interface ClubListProps {
  clubs: Club[];
  isLoading?: boolean;
  onEdit?: (club: Club) => void;
}

const ClubList = ({ clubs, isLoading, onEdit }: ClubListProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteClub } = useDeleteClub({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('동아리가 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('동아리 삭제 실패:', error);
      toast.error('동아리 삭제에 실패했습니다.');
    },
  });

  return (
    <div className={cn('mb-4 overflow-x-auto rounded-md border')}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>동아리명</TableHead>
            <TableHead>타입</TableHead>
            <TableHead className={cn('w-30')}>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className={cn('h-4 w-32')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-5 w-16')} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={cn('h-8 w-8')} />
                  </TableCell>
                </TableRow>
              ))
            : clubs.map((club) => (
                <TableRow key={club.id}>
                  <TableCell className={cn('font-medium')}>{club.name}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(club.type)}>
                      {getTypeLabel(club.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit?.(club)}>
                        <Pencil className={cn('h-4 w-4')} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="삭제">
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>동아리 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              정말로 {club.name} 동아리를 삭제하시겠습니까? 이 작업은 되돌릴 수
                              없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteClub(club.id)}
                              className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClubList;
