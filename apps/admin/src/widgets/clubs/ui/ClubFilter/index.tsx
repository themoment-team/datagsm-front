import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';
import { Control, Controller } from 'react-hook-form';

import { ClubFilterType } from '@/entities/club';

interface ClubFilterProps {
  control: Control<ClubFilterType>;
}

const ClubFilter = ({ control }: ClubFilterProps) => {
  return (
    <div className="mt-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm">타입:</Label>
        <Controller
          control={control}
          name="clubType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="MAJOR_CLUB">전공</SelectItem>
                <SelectItem value="JOB_CLUB">취업</SelectItem>
                <SelectItem value="AUTONOMOUS_CLUB">자율</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};

export default ClubFilter;
