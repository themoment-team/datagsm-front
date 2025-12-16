import { Club, ClubType } from '@repo/shared/types';
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
import { Pencil } from 'lucide-react';

interface ClubListProps {
  clubs: Club[];
  isLoading?: boolean;
}

const getTypeBadgeVariant = (type: ClubType) => {
  switch (type) {
    case 'MAJOR_CLUB':
      return 'default';
    case 'JOB_CLUB':
      return 'secondary';
    case 'AUTONOMOUS_CLUB':
      return 'outline';
    default:
      return 'outline';
  }
};

const getTypeLabel = (type: ClubType) => {
  switch (type) {
    case 'MAJOR_CLUB':
      return '전공';
    case 'JOB_CLUB':
      return '취업';
    case 'AUTONOMOUS_CLUB':
      return '자율';
    default:
      return '-';
  }
};

export const ClubList = ({ clubs, isLoading }: ClubListProps) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>동아리명</TableHead>
              <TableHead>타입</TableHead>
              <TableHead className="w-20">수정</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>동아리명</TableHead>
            <TableHead>타입</TableHead>
            <TableHead className="w-20">수정</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => (
            <TableRow key={club.id}>
              <TableCell className="font-medium">{club.name}</TableCell>
              <TableCell>
                <Badge variant={getTypeBadgeVariant(club.type)}>{getTypeLabel(club.type)}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
