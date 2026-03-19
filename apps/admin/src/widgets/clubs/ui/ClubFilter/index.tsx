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

import { ClubFilterType } from '@/entities/club';

interface ClubFilterProps {
  control: Control<ClubFilterType>;
}

const ClubFilter = ({ control }: ClubFilterProps) => {
  return (
    <div className={cn('mt-4 flex flex-col justify-center gap-4')}>
      <div className={cn('relative flex-1')}>
        <Search
          className={cn('text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2')}
        />
        <Controller
          control={control}
          name="clubName"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="동아리 이름으로 검색"
              className={cn('pl-9 rounded-none border-foreground focus-visible:ring-0 focus-visible:border-foreground font-mono')}
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
          <Label className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}>타입:</Label>
          <Controller
            control={control}
            name="clubType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={cn('w-24 rounded-none border-foreground focus-visible:ring-0')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="MAJOR_CLUB">전공</SelectItem>
                  <SelectItem value="AUTONOMOUS_CLUB">자율</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className={cn('flex items-center gap-2')}>
          <Label className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}>상태:</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value ?? 'all'}
                onValueChange={(v) => field.onChange(v === 'all' ? undefined : v)}
              >
                <SelectTrigger className={cn('w-24 rounded-none border-foreground focus-visible:ring-0')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="ACTIVE">운영중</SelectItem>
                  <SelectItem value="ABOLISHED">폐지</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ClubFilter;
