import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Search } from 'lucide-react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';

import { Club } from '@repo/shared/types';
import { ProjectFilterType } from '@/entities/project';

interface ProjectFilterProps {
  register: UseFormRegister<ProjectFilterType>;
  control: Control<ProjectFilterType>;
  clubs: Club[];
}

const ProjectFilter = ({ register, control, clubs }: ProjectFilterProps) => {
  return (
    <div className={cn('mt-4 flex flex-col gap-4')}>
      <div className={cn('flex items-center gap-2')}>
        <div className={cn('relative flex-1')}>
          <Search
            className={cn(
              'text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
            )}
          />
          <Input
            placeholder="프로젝트 이름으로 검색"
            className={cn('pl-9')}
            {...register('searchTerm')}
          />
        </div>
      </div>

      <div className={cn('flex flex-wrap items-center gap-4')}>
        <div className={cn('flex items-center gap-2')}>
          <Label className={cn('text-sm shrink-0')}>동아리:</Label>
          <Controller
            control={control}
            name="clubId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : 'all'}
                onValueChange={(val) => field.onChange(val === 'all' ? undefined : Number(val))}
              >
                <SelectTrigger className={cn('w-40')}>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={String(club.id)}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;
