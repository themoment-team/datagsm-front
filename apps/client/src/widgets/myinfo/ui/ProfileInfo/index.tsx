import { MyAccount } from '@repo/shared/types';
import { SectionCard } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { GraduationCap, Home, Mail, Shield, User } from 'lucide-react';

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
              <span className={cn('border border-foreground/25 px-1.5 py-0.5 text-xs font-mono uppercase')}>{MAJOR_MAP[student.major] || student.major}</span>
              {isAdmin && <span className={cn('border border-destructive/40 px-1.5 py-0.5 text-xs font-mono uppercase text-destructive')}>{role}</span>}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 학적 정보 */}
      <SectionCard title="학적 정보" icon={<GraduationCap />}>
        <div className={cn('grid grid-flow-col grid-rows-3')}>
          <InfoItem label="이름" value={student.name} />
          <InfoItem label="학과" value={MAJOR_MAP[student.major] || student.major} />
          <InfoItem label="성별" value={SEX_MAP[student.sex] || student.sex} />
          <InfoItem label="학년" value={`${student.grade}학년`} />
          <InfoItem label="반" value={`${student.classNum}반`} />
          <InfoItem label="번호" value={`${student.number}번`} />
        </div>
      </SectionCard>

      {/* 기숙사 및 동아리 정보 */}
      <SectionCard title="기숙사 및 동아리" icon={<Home />}>
        <div className={cn('grid grid-cols-2')}>
          <InfoItem label="기숙사 호실" value={`${student.dormitoryFloor}층 ${student.dormitoryRoom}호`} className={cn('col-span-2')} />
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

const InfoItem = ({ label, value, icon, className }: { label: string; value: string; icon?: React.ReactNode; className?: string }) => (
  <div className={cn('border-b border-r border-foreground/10 px-5 py-4 last:border-b-0', className)}>
    <p className={cn('mb-1 text-xs font-mono uppercase tracking-widest text-muted-foreground')}>{label}</p>
    <p className={cn('flex items-center gap-2 text-sm font-medium')}>
      {icon}
      {value}
    </p>
  </div>
);
