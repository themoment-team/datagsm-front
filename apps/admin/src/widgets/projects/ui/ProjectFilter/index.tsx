import { Club } from '@repo/shared/types';
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
import { Control, Controller } from 'react-hook-form';

import { ProjectFilterType } from '@/entities/project';

interface ProjectFilterProps {
  control: Control<ProjectFilterType>;
  clubs: Club[];
}

const ProjectFilter = ({ control, clubs }: ProjectFilterProps) => {
  return (
    <div className={cn('mt-4 flex flex-col justify-center gap-4')}>
      <div className={cn('relative flex-1')}>
        <Search
          className={cn('text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2')}
        />
        <Controller
          control={control}
          name="projectName"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="프로젝트 이름으로 검색"
              className={cn('border-foreground rounded-none pl-9 font-mono')}
              onChange={(e) => {
                field.onChange(e.target.value || 'all');
              }}
              value={field.value === 'all' ? '' : field.value}
            />
          )}
        />
      </div>

      <div className={cn('flex items-center gap-4')}>
        <div className={cn('flex items-center gap-2')}>
          <Label
            className={cn('text-muted-foreground font-mono text-xs uppercase tracking-widest')}
          >
            상태:
          </Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value ?? 'ACTIVE'} onValueChange={field.onChange}>
                <SelectTrigger className={cn('border-foreground w-28 rounded-none')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">운영 중</SelectItem>
                  <SelectItem value="ENDED">종료</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className={cn('flex items-center gap-2')}>
          <Label
            className={cn('text-muted-foreground font-mono text-xs uppercase tracking-widest')}
          >
            동아리:
          </Label>
          <Controller
            control={control}
            name="clubId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : 'all'}
                onValueChange={(val) => field.onChange(val === 'all' ? undefined : Number(val))}
              >
                <SelectTrigger className={cn('border-foreground w-40 rounded-none')}>
                  <SelectValue />
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
