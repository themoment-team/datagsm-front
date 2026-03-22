import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Control, Controller } from 'react-hook-form';

import { ApiKeyFilterType } from '@/entities/api-key';

interface ApiKeyFilterProps {
  control: Control<ApiKeyFilterType>;
}

const ApiKeyFilter = ({ control }: ApiKeyFilterProps) => {
  return (
    <div className={cn('mt-4 flex flex-wrap items-center gap-4')}>
      <div className={cn('flex items-center gap-2')}>
        <Label className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}>만료 여부:</Label>
        <Controller
          control={control}
          name="isExpired"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn('w-28 rounded-none border-foreground')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="true">만료됨</SelectItem>
                <SelectItem value="false">사용 가능</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className={cn('flex items-center gap-2')}>
        <Label className={cn('text-xs uppercase tracking-widest text-muted-foreground font-mono')}>갱신 여부:</Label>
        <Controller
          control={control}
          name="isRenewable"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn('w-28 rounded-none border-foreground')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="true">갱신 가능</SelectItem>
                <SelectItem value="false">갱신 불가</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};

export default ApiKeyFilter;
