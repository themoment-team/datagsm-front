import { Project } from '@repo/shared/types';
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
import { cn } from '@repo/shared/utils';
import { Pencil, Trash2 } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: number) => void;
}

const ProjectList = ({ projects, isLoading, onEdit, onDelete }: ProjectListProps) => {
  return (
    <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>설명</TableHead>
            <TableHead>동아리</TableHead>
            <TableHead className={cn('w-24')}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className={cn('h-4 w-32')} />
                </TableCell>
                <TableCell>
                  <Skeleton className={cn('h-4 w-48')} />
                </TableCell>
                <TableCell>
                  <Skeleton className={cn('h-4 w-24')} />
                </TableCell>
                <TableCell>
                  <Skeleton className={cn('h-8 w-8')} />
                </TableCell>
              </TableRow>
            ))
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className={cn('font-medium')}>{project.name}</TableCell>
                <TableCell className={cn('max-w-xs truncate')}>{project.description}</TableCell>
                <TableCell>{project.club?.name || '무소속'}</TableCell>
                <TableCell>
                  <div className={cn('flex items-center gap-2')}>
                    <Button variant="ghost" size="icon" onClick={() => onEdit?.(project)}>
                      <Pencil className={cn('h-4 w-4')} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className={cn('text-destructive')}>
                          <Trash2 className={cn('h-4 w-4')} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>프로젝트 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            정말로 &apos;{project.name}&apos; 프로젝트를 삭제하시겠습니까? 이 작업은
                            되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete?.(project.id)}
                            className={cn('bg-destructive hover:bg-destructive/90 text-white')}
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
              <TableCell colSpan={4} className={cn('text-muted-foreground h-32 text-center')}>
                프로젝트 데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
  );
};

export default ProjectList;
