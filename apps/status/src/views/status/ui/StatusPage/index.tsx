import { Activity } from 'lucide-react';

import { cn } from '@repo/shared/utils';

import type { HealthStatusData } from '@/entities/status';
import { StatusDashboard } from '@/widgets/status';

interface StatusPageProps {
  initialHealthStatus: HealthStatusData;
}

const StatusPage = ({ initialHealthStatus }: StatusPageProps) => {
  return (
    <div className={cn('bg-background min-h-[calc(100vh-3.5rem)]')}>
      <main className={cn('container mx-auto px-4 py-16')}>
        <div className={cn('mx-auto max-w-2xl')}>
          <div className={cn('mb-10 text-center')}>
            <div className={cn('mb-4 inline-flex h-12 w-12 items-center justify-center border border-foreground/30')}>
              <Activity className={cn('h-6 w-6')} />
            </div>
            <h1 className={cn('font-pixel text-[12px] leading-[1.8]')}>서비스 상태</h1>
            <p className={cn('mt-3 font-mono text-xs text-muted-foreground')}>
              {'>'} DataGSM 서비스의 실시간 상태를 확인합니다
            </p>
          </div>

          <StatusDashboard initialHealthStatus={initialHealthStatus} />
        </div>
      </main>
    </div>
  );
};

export default StatusPage;
