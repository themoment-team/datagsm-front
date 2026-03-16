import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/shared/ui';
import { GraduationCap, Home, Mail, Shield, User } from 'lucide-react';

import { MyAccount } from '@/entities/mypage';

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
            />
            <div />
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

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="flex items-center gap-2 font-medium">
        {icon}
        {value}
      </p>
    </div>
  );
}
