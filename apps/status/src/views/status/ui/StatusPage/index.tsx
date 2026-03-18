import { Activity } from 'lucide-react';

import type { HealthStatusData } from '@/entities/status';
import { StatusDashboard } from '@/widgets/status';

interface StatusPageProps {
  initialHealthStatus: HealthStatusData;
}

const StatusPage = ({ initialHealthStatus }: StatusPageProps) => {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center border border-foreground/30">
              <Activity className="h-6 w-6" />
            </div>
            <h1 className="font-pixel text-[12px] leading-[1.8]">서비스 상태</h1>
            <p className="text-muted-foreground mt-2 font-mono text-xs">
              DataGSM 서비스의 실시간 상태를 확인합니다
            </p>
          </div>

          <StatusDashboard initialHealthStatus={initialHealthStatus} />
        </div>
      </main>
    </div>
  );
};

export default StatusPage;
