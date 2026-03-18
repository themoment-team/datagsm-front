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

import { StudentFilterType } from '@/entities/student';

interface StudentFilterProps {
  control: Control<StudentFilterType>;
}

const StudentFilter = ({ control }: StudentFilterProps) => {
  return (
    <div className={cn('mt-4 flex flex-wrap items-center gap-4')}>
      <div className={cn('relative flex-1')}>
        <Search
          className={cn('text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2')}
        />
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="학생 이름으로 검색"
              className={cn('pl-9')}
              onChange={(e) => {
                field.onChange(e.target.value || 'all');
              }}
              value={field.value === 'all' ? '' : field.value}
            />
          )}
        />
      </div>

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
                <SelectItem value="ENROLLED">재학</SelectItem>
                <SelectItem value="GRADUATE">졸업</SelectItem>
                <SelectItem value="WITHDRAWN">자퇴</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className={cn('flex items-center gap-2')}>
        <Label className={cn('text-sm')}>정렬 기준:</Label>
        <Controller
          control={control}
          name="sortBy"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn('w-32')}>
                <SelectValue placeholder="기본" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">기본</SelectItem>
                <SelectItem value="ID">ID</SelectItem>
                <SelectItem value="NAME">이름</SelectItem>
                <SelectItem value="EMAIL">이메일</SelectItem>
                <SelectItem value="STUDENT_NUMBER">학번</SelectItem>
                <SelectItem value="GRADE">학년</SelectItem>
                <SelectItem value="CLASS_NUM">반</SelectItem>
                <SelectItem value="NUMBER">번호</SelectItem>
                <SelectItem value="MAJOR">전공</SelectItem>
                <SelectItem value="ROLE">역할</SelectItem>
                <SelectItem value="SEX">성별</SelectItem>
                <SelectItem value="DORMITORY_ROOM">기숙사 호실</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};

export default StudentFilter;
