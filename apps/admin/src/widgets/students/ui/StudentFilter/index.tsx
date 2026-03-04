import {
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Control, Controller } from 'react-hook-form';

import { StudentFilterType } from '@/entities/student';

interface StudentFilterProps {
  control: Control<StudentFilterType>;
}

const StudentFilter = ({ control }: StudentFilterProps) => {
  return (
    <div className={cn('mt-4 flex items-center gap-4')}>
      <div className={cn('flex items-center gap-2')}>
        <Label className={cn('text-sm')}>학년:</Label>
        <Controller
          control={control}
          name="grade"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn('w-24')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="1">1학년</SelectItem>
                <SelectItem value="2">2학년</SelectItem>
                <SelectItem value="3">3학년</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className={cn('flex items-center gap-2')}>
        <Label className={cn('text-sm')}>반:</Label>
        <Controller
          control={control}
          name="classNum"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn('w-24')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="1">1반</SelectItem>
                <SelectItem value="2">2반</SelectItem>
                <SelectItem value="3">3반</SelectItem>
                <SelectItem value="4">4반</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className={cn('flex items-center gap-2')}>
        <Label className={cn('text-sm')}>성별:</Label>
        <Controller
          control={control}
          name="sex"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn('w-24')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="MAN">남성</SelectItem>
                <SelectItem value="WOMAN">여성</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className={cn('flex items-center gap-2')}>
        <Label className={cn('text-sm')}>구분:</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn('w-24')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="GENERAL_STUDENT">일반학생</SelectItem>
                <SelectItem value="DORMITORY_MANAGER">기자위</SelectItem>
                <SelectItem value="STUDENT_COUNCIL">학생회</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className={cn('flex items-center gap-2')}>
        <Label className={cn('text-sm')}>재학 여부:</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn('w-24')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="ENROLLED">재학</SelectItem>
                <SelectItem value="GRADUATE">졸업</SelectItem>
                <SelectItem value="WITHDRAWN">자퇴</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className={cn('ml-auto flex items-center gap-2')}>
        <Controller
          control={control}
          name="includeGraduates"
          render={({ field }) => (
            <Checkbox
              id="includeGraduates"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="includeGraduates" className={cn('cursor-pointer text-sm')}>
          졸업생 포함
        </Label>
      </div>
    </div>
  );
};

export default StudentFilter;
