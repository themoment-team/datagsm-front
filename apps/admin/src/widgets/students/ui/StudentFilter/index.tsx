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
              <SelectTrigger className={cn('w-24 cursor-pointer')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className={cn('cursor-pointer')}>
                  전체
                </SelectItem>
                <SelectItem value="1" className={cn('cursor-pointer')}>
                  1학년
                </SelectItem>
                <SelectItem value="2" className={cn('cursor-pointer')}>
                  2학년
                </SelectItem>
                <SelectItem value="3" className={cn('cursor-pointer')}>
                  3학년
                </SelectItem>
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
              <SelectTrigger className={cn('w-24 cursor-pointer')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className={cn('cursor-pointer')}>
                  전체
                </SelectItem>
                <SelectItem value="1" className={cn('cursor-pointer')}>
                  1반
                </SelectItem>
                <SelectItem value="2" className={cn('cursor-pointer')}>
                  2반
                </SelectItem>
                <SelectItem value="3" className={cn('cursor-pointer')}>
                  3반
                </SelectItem>
                <SelectItem value="4" className={cn('cursor-pointer')}>
                  4반
                </SelectItem>
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
              <SelectTrigger className={cn('w-24 cursor-pointer')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className={cn('cursor-pointer')}>
                  전체
                </SelectItem>
                <SelectItem value="MAN" className={cn('cursor-pointer')}>
                  남성
                </SelectItem>
                <SelectItem value="WOMAN" className={cn('cursor-pointer')}>
                  여성
                </SelectItem>
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
              <SelectTrigger className={cn('w-24 cursor-pointer')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className={cn('cursor-pointer')}>
                  전체
                </SelectItem>
                <SelectItem value="GENERAL_STUDENT" className={cn('cursor-pointer')}>
                  일반학생
                </SelectItem>
                <SelectItem value="DORMITORY_MANAGER" className={cn('cursor-pointer')}>
                  기자위
                </SelectItem>
                <SelectItem value="STUDENT_COUNCIL" className={cn('cursor-pointer')}>
                  학생회
                </SelectItem>
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
              <SelectTrigger className={cn('w-24 cursor-pointer')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className={cn('cursor-pointer')}>
                  전체
                </SelectItem>
                <SelectItem value="false" className={cn('cursor-pointer')}>
                  재학
                </SelectItem>
                <SelectItem value="true" className={cn('cursor-pointer')}>
                  자퇴
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};

export default StudentFilter;
