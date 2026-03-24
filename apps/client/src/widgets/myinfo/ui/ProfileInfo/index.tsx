'use client';

import { useState } from 'react';

import { SPECIALTY_OPTIONS } from '@repo/shared/constants';
import { MyAccount } from '@repo/shared/types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Briefcase, GraduationCap, Home, Mail, Pencil, Shield, User, X } from 'lucide-react';
import { toast } from 'sonner';

import { usePatchMySpecialty } from '../../model/usePatchMySpecialty';

interface ProfileInfoProps {
  data: MyAccount;
}

const MAJOR_MAP: Record<string, string> = {
  SW_DEVELOPMENT: '소프트웨어개발과',
  SMART_IOT: '스마트IOT과',
  AI: '인공지능과',
};

const ROLE_MAP: Record<string, string> = {
  GENERAL_STUDENT: '일반학생',
  STUDENT_COUNCIL: '학생회',
  DORMITORY_MANAGER: '기숙사자치위원회',
};

const SEX_MAP: Record<string, string> = {
  MAN: '남',
  WOMAN: '여',
};

export const ProfileInfo = ({ data }: ProfileInfoProps) => {
  const { student, email, role } = data;

  const isAdmin = role === 'ROOT' || role === 'ADMIN';

  if (!student) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full">
                <User className="text-primary-foreground h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">정보 없음</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-2">
                  <Badge variant="outline">{email}</Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">등록된 학생 정보가 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full">
              <User className="text-primary-foreground h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                <Badge variant="secondary">{MAJOR_MAP[student.major] || student.major}</Badge>
                {isAdmin && <Badge variant="destructive">Role: {role}</Badge>}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5" />
            학적 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-flow-col grid-rows-3 gap-4">
            <InfoItem label="이름" value={student.name} />
            <InfoItem label="학과" value={MAJOR_MAP[student.major] || student.major} />
            <InfoItem label="성별" value={SEX_MAP[student.sex] || student.sex} />
            <InfoItem label="학년" value={`${student.grade}학년`} />
            <InfoItem label="반" value={`${student.classNum}반`} />
            <InfoItem label="번호" value={`${student.number}번`} />
          </div>
        </CardContent>
      </Card>

      {/* 전공 */}
      <SpecialtyCard currentSpecialty={student.specialty} />

      {/* 기숙사 및 동아리 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Home className="h-5 w-5" />
            기숙사 및 동아리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              label="기숙사 호실"
              value={`${student.dormitoryFloor}층 ${student.dormitoryRoom}호`}
              className="col-span-2"
            />
            <InfoItem label="전공동아리" value={student.majorClub?.name || '없음'} />
            <InfoItem label="자율동아리" value={student.autonomousClub?.name || '없음'} />
          </div>
        </CardContent>
      </Card>

      {/* 계정 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            계정 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              label="이메일"
              value={email}
              icon={<Mail className="text-muted-foreground h-4 w-4" />}
            />
            <InfoItem label="학생 역할" value={ROLE_MAP[student.role] || student.role} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SpecialtyCard = ({ currentSpecialty }: { currentSpecialty: string | null }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [selected, setSelected] = useState('none');
  const [customValue, setCustomValue] = useState('');

  const { mutate: patchSpecialty, isPending } = usePatchMySpecialty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', 'my'] });
      setIsEditing(false);
      toast.success('전공이 수정되었습니다.');
    },
    onError: () => {
      toast.error('전공 수정에 실패했습니다.');
    },
  });

  const startEdit = () => {
    const isCustom =
      currentSpecialty !== null &&
      !SPECIALTY_OPTIONS.includes(currentSpecialty as (typeof SPECIALTY_OPTIONS)[number]);
    setIsCustom(isCustom);
    setSelected(isCustom ? 'custom' : (currentSpecialty ?? 'none'));
    setCustomValue(isCustom ? currentSpecialty! : '');
    setIsEditing(true);
  };

  const handleSave = () => {
    const value = isCustom ? customValue.trim() || null : selected === 'none' ? null : selected;
    patchSpecialty({ specialty: value });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5" />
            진로 정보
          </CardTitle>
          {!isEditing && (
            <Button variant="ghost" size="icon" onClick={startEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <p className={cn('font-medium', !currentSpecialty && 'text-muted-foreground')}>
            {currentSpecialty ?? '미설정'}
          </p>
        ) : (
          <div className="space-y-3">
            {isCustom ? (
              <div className="flex gap-2">
                <Input
                  placeholder="전공 직접 입력"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setIsCustom(false);
                    setCustomValue('');
                    setSelected('none');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Select
                value={selected ?? 'none'}
                onValueChange={(val) => {
                  if (val === 'custom') {
                    setIsCustom(true);
                    setSelected('custom');
                  } else {
                    setSelected(val);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="전공 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-gray-500">
                    선택 안 함
                  </SelectItem>
                  {SPECIALTY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">직접 입력...</SelectItem>
                </SelectContent>
              </Select>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={isPending}>
                취소
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isPending}>
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InfoItem = ({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="flex items-center gap-2 font-medium">
        {icon}
        {value}
      </p>
    </div>
  );
};
