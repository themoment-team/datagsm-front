import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';

interface StudentFilterProps {
  gradeFilter: string;
  setGradeFilter: (value: string) => void;
  majorFilter: string;
  setMajorFilter: (value: string) => void;
}

const StudentFilter = ({
  gradeFilter,
  setGradeFilter,
  majorFilter,
  setMajorFilter,
}: StudentFilterProps) => {
  return (
    <div className="mt-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm">학년:</Label>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-24 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              전체
            </SelectItem>
            <SelectItem value="1" className="cursor-pointer">
              1학년
            </SelectItem>
            <SelectItem value="2" className="cursor-pointer">
              2학년
            </SelectItem>
            <SelectItem value="3" className="cursor-pointer">
              3학년
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-sm">학과:</Label>
        <Select value={majorFilter} onValueChange={setMajorFilter}>
          <SelectTrigger className="w-32 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              전체
            </SelectItem>
            <SelectItem value="SW_DEVELOPMENT" className="cursor-pointer">
              SW개발과
            </SelectItem>
            <SelectItem value="SMART_IOT" className="cursor-pointer">
              스마트IoT과
            </SelectItem>
            <SelectItem value="AI" className="cursor-pointer">
              AI과
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StudentFilter;
