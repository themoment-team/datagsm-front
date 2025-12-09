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
  classNumFilter: string;
  setClassNumFilter: (value: string) => void;
  sexFilter: string;
  setSexFilter: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const StudentFilter = ({
  gradeFilter,
  setGradeFilter,
  classNumFilter,
  setClassNumFilter,
  sexFilter,
  setSexFilter,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
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
        <Label className="text-sm">반:</Label>
        <Select value={classNumFilter} onValueChange={setClassNumFilter}>
          <SelectTrigger className="w-24 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              전체
            </SelectItem>
            <SelectItem value="1" className="cursor-pointer">
              1반
            </SelectItem>
            <SelectItem value="2" className="cursor-pointer">
              2반
            </SelectItem>
            <SelectItem value="3" className="cursor-pointer">
              3반
            </SelectItem>
            <SelectItem value="4" className="cursor-pointer">
              4반
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-sm">성별:</Label>
        <Select value={sexFilter} onValueChange={setSexFilter}>
          <SelectTrigger className="w-24 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              전체
            </SelectItem>
            <SelectItem value="MAN" className="cursor-pointer">
              남성
            </SelectItem>
            <SelectItem value="WOMAN" className="cursor-pointer">
              여성
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-sm">역할:</Label>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-32 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              전체
            </SelectItem>
            <SelectItem value="GENERAL_STUDENT" className="cursor-pointer">
              일반학생
            </SelectItem>
            <SelectItem value="DORMITORY_MANAGER" className="cursor-pointer">
              기자위
            </SelectItem>
            <SelectItem value="STUDENT_COUNCIL" className="cursor-pointer">
              학생회
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-sm">재학 여부:</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              전체
            </SelectItem>
            <SelectItem value="false" className="cursor-pointer">
              재학
            </SelectItem>
            <SelectItem value="true" className="cursor-pointer">
              자퇴
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StudentFilter;
