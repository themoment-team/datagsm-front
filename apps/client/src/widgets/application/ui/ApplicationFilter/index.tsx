import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Control, Controller } from 'react-hook-form';

export interface ApplicationFilterValues {
  name: string;
}

interface ApplicationFilterProps {
  control: Control<ApplicationFilterValues>;
  applicationNames: string[];
  isLoading?: boolean;
}

const ApplicationFilter = ({ control, applicationNames, isLoading }: ApplicationFilterProps) => {
  return (
    <div className={cn('flex items-center gap-2')}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
            <SelectTrigger className={cn('w-72 rounded-none border-foreground font-mono')}>
              <SelectValue placeholder={isLoading ? '로딩 중...' : '애플리케이션 선택'} />
            </SelectTrigger>
            <SelectContent className={cn('rounded-none border-foreground')}>
              <SelectItem value="all" className={cn('font-mono')}>전체</SelectItem>
              {applicationNames.map((name) => (
                <SelectItem key={name} value={name} className={cn('font-mono')}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default ApplicationFilter;
