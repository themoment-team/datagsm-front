'use client';

import { useState } from 'react';

import { accountQueryKeys } from '@repo/shared/api';
import { SPECIALTY_OPTIONS } from '@repo/shared/constants';
import { MyAccount } from '@repo/shared/types';
import {
  Button,
  Input,
  PixelIconButton,
  SectionCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Briefcase, GraduationCap, Home, Link, Mail, Pencil, Shield, User, X } from 'lucide-react';
import { toast } from 'sonner';

import { usePatchMyGithubId, usePatchMySpecialty } from '@/widgets/myinfo';

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
  GRADUATE: '졸업생',
  WITHDRAWN: '자퇴생',
};

const SEX_MAP: Record<string, string> = {
  MAN: '남',
  WOMAN: '여',
};

export const ProfileInfo = ({ data }: ProfileInfoProps) => {
  const { student, email, role } = data;
  const isAdmin = role === 'ROOT' || role === 'ADMIN';
  const isInactive = student?.role === 'GRADUATE' || student?.role === 'WITHDRAWN';

  if (!student) {
    return (
      <div className={cn('space-y-4')}>
        <SectionCard title="PROFILE" shadow>
          <div className={cn('flex items-center gap-4 px-5 py-5')}>
            <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center border-2 border-foreground')}>
              <User className={cn('h-7 w-7')} />
            </div>
            <div>
              <p className={cn('font-pixel text-[13px]')}>정보 없음</p>
              <span className={cn('mt-2 inline-block border border-foreground/25 px-1.5 py-0.5 text-xs font-mono')}>{email}</span>
            </div>
          </div>
        </SectionCard>
        <div className={cn('border-2 border-foreground px-5 py-6 text-center')}>
          <p className={cn('text-sm font-mono text-muted-foreground')}>{'// 등록된 학생 정보가 없습니다'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4')}>
      {/* 프로필 헤더 */}
      <SectionCard title="PROFILE" shadow>
        <div className={cn('flex items-center gap-4 px-5 py-5')}>
          <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center border-2 border-foreground')}>
            <User className={cn('h-7 w-7')} />
          </div>
          <div>
            <p className={cn('font-pixel text-[14px]')}>{student.name}</p>
            <div className={cn('mt-2 flex flex-wrap items-center gap-2')}>
              {student.major && <span className={cn('border border-foreground/25 px-1.5 py-0.5 text-xs font-mono uppercase')}>{MAJOR_MAP[student.major] || student.major}</span>}
              {isAdmin && <span className={cn('border border-destructive/40 px-1.5 py-0.5 text-xs font-mono uppercase text-destructive')}>{role}</span>}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 학적 정보 */}
      <SectionCard title="학적 정보" icon={<GraduationCap />}>
        <div className={cn('grid grid-flow-col grid-rows-3')}>
          <InfoItem label="이름" value={student.name} />
          <InfoItem label="학과" value={student.major ? (MAJOR_MAP[student.major] || student.major) : '-'} />
          <InfoItem label="성별" value={student.sex ? (SEX_MAP[student.sex] || student.sex) : '-'} />
          <InfoItem label="학년" value={isInactive || !student.grade ? '-' : `${student.grade}학년`} />
          <InfoItem label="반" value={isInactive || !student.classNum ? '-' : `${student.classNum}반`} />
          <InfoItem label="번호" value={isInactive || !student.number ? '-' : `${student.number}번`} />
        </div>
      </SectionCard>

      {/* 진로 정보 */}
      <SpecialtyCard currentSpecialty={student.specialty} isInactive={isInactive} />

      {/* GitHub 정보 */}
      <GithubIdCard currentGithubId={student.githubId} isInactive={isInactive} />

      {/* 기숙사 및 동아리 정보 */}
      <SectionCard title="기숙사 및 동아리" icon={<Home />}>
        <div className={cn('grid grid-cols-2')}>
          <InfoItem
            label="기숙사 호실"
            value={isInactive || (!student.dormitoryFloor && !student.dormitoryRoom) ? '-' : `${student.dormitoryFloor}층 ${student.dormitoryRoom}호`}
            className={cn('col-span-2')}
          />
          <InfoItem label="전공동아리" value={student.majorClub?.name || '없음'} />
          <InfoItem label="자율동아리" value={student.autonomousClub?.name || '없음'} />
        </div>
      </SectionCard>

      {/* 계정 정보 */}
      <SectionCard title="계정 정보" icon={<Shield />}>
        <div className={cn('grid grid-cols-2')}>
          <InfoItem label="이메일" value={email} icon={<Mail className={cn('h-4 w-4 text-muted-foreground')} />} />
          <InfoItem label="학생 역할" value={ROLE_MAP[student.role] || student.role} />
        </div>
      </SectionCard>
    </div>
  );
};

const SpecialtyCard = ({ currentSpecialty, isInactive }: { currentSpecialty: string | null; isInactive: boolean }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [selected, setSelected] = useState('none');
  const [customValue, setCustomValue] = useState('');

  const { mutate: patchSpecialty, isPending } = usePatchMySpecialty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.getMy() });
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
    <SectionCard
      title="진로 정보"
      icon={<Briefcase />}
      headerAction={
        !isEditing && !isInactive && (
          <PixelIconButton size="sm" onClick={startEdit} aria-label="진로 정보 수정">
            <Pencil className={cn('h-3 w-3')} />
          </PixelIconButton>
        )
      }
    >
      <div className={cn('px-5 py-4')}>
        {!isEditing ? (
          <p className={cn('text-sm font-mono', !currentSpecialty && 'text-muted-foreground')}>
            {currentSpecialty ?? '// 미설정'}
          </p>
        ) : (
          <div className={cn('space-y-3')}>
            {isCustom ? (
              <div className={cn('flex gap-2')}>
                <Input
                  placeholder="진로 직접 입력"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className={cn('flex-1 rounded-none border-foreground font-mono')}
                  autoFocus
                />
                <PixelIconButton
                  onClick={() => {
                    setIsCustom(false);
                    setCustomValue('');
                    setSelected('none');
                  }}
                  aria-label="직접 입력 취소"
                >
                  <X className={cn('h-3.5 w-3.5')} />
                </PixelIconButton>
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
                <SelectTrigger className={cn('rounded-none border-foreground')}>
                  <SelectValue placeholder="진로 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className={cn('font-mono text-muted-foreground')}>
                    선택 안 함
                  </SelectItem>
                  {SPECIALTY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt} className={cn('font-mono')}>
                      {opt}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className={cn('font-mono')}>
                    직접 입력...
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
            <div className={cn('flex justify-end gap-2')}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isPending}
                className={cn('font-mono text-xs')}
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isPending}
                className={cn('font-mono text-xs')}
              >
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

const GithubIdCard = ({ currentGithubId, isInactive }: { currentGithubId: string | null; isInactive: boolean }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { mutate: patchGithubId, isPending } = usePatchMyGithubId({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.getMy() });
      setIsEditing(false);
      toast.success('GitHub ID가 수정되었습니다.');
    },
    onError: () => {
      toast.error('GitHub ID 수정에 실패했습니다.');
    },
  });

  const startEdit = () => {
    setInputValue(currentGithubId ?? '');
    setIsEditing(true);
  };

  const handleSave = () => {
    patchGithubId({ githubId: inputValue.trim() || null });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <SectionCard
      title="GitHub"
      icon={<Link />}
      headerAction={
        !isEditing && !isInactive && (
          <PixelIconButton size="sm" onClick={startEdit} aria-label="GitHub ID 수정">
            <Pencil className={cn('h-3 w-3')} />
          </PixelIconButton>
        )
      }
    >
      <div className={cn('px-5 py-4')}>
        {!isEditing ? (
          currentGithubId ? (
            <a
              href={`https://github.com/${currentGithubId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn('text-sm font-mono underline underline-offset-4')}
            >
              {currentGithubId}
            </a>
          ) : (
            <p className={cn('text-sm font-mono text-muted-foreground')}>{'// 미설정'}</p>
          )
        ) : (
          <div className={cn('space-y-3')}>
            <Input
              placeholder="GitHub 아이디 입력"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={cn('rounded-none border-foreground font-mono')}
              autoFocus
            />
            <div className={cn('flex justify-end gap-2')}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isPending}
                className={cn('font-mono text-xs')}
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isPending}
                className={cn('font-mono text-xs')}
              >
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

const InfoItem = ({ label, value, icon, className }: { label: string; value: string; icon?: React.ReactNode; className?: string }) => (
  <div className={cn('border-b border-r border-foreground/10 px-5 py-4 last:border-b-0', className)}>
    <p className={cn('mb-1 text-xs font-mono uppercase tracking-widest text-muted-foreground')}>{label}</p>
    <p className={cn('flex items-center gap-2 text-sm font-medium')}>
      {icon}
      {value}
    </p>
  </div>
);
