import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/ui';
import { Pencil } from 'lucide-react';

interface Club {
  id: number;
  name: string;
  type: string;
}

interface ClubListProps {
  clubs: Club[];
}

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case '전공':
      return 'default';
    case '취업':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const ClubList = ({ clubs }: ClubListProps) => {
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
                <Badge variant={getTypeBadgeVariant(club.type)}>{club.type}</Badge>
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
