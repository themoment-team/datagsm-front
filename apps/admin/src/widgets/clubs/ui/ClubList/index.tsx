import { Club } from '@repo/shared/types';
import {
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
import { Pencil } from 'lucide-react';

import { getTypeBadgeVariant, getTypeLabel } from '@/entities/club';

interface ClubListProps {
  clubs: Club[];
  isLoading?: boolean;
}

const ClubList = ({ clubs, isLoading }: ClubListProps) => {
  return (
    <div className={cn('mb-4 overflow-x-auto rounded-md border')}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>동아리명</TableHead>
            <TableHead>타입</TableHead>
            <TableHead className={cn('w-20')}>수정</TableHead>
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
                    <Button variant="ghost" size="icon">
                      <Pencil className={cn('h-4 w-4')} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClubList;
