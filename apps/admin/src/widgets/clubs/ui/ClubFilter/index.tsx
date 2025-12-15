import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';

interface ClubFilterProps {
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

export const ClubFilter = ({ typeFilter, onTypeFilterChange }: ClubFilterProps) => {
  return (
    <div className="mt-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm">타입:</Label>
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="전공">전공</SelectItem>
            <SelectItem value="취업">취업</SelectItem>
            <SelectItem value="자율">자율</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
