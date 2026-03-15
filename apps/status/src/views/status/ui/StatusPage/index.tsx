import { Activity } from 'lucide-react';

import { StatusDashboard } from '@/widgets/status';

const StatusPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
              <Activity className="text-primary h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">서비스 상태</h1>
            <p className="text-muted-foreground mt-2">DataGSM 서비스의 실시간 상태를 확인합니다</p>
          </div>

          <StatusDashboard />
        </div>
      </main>
    </div>
  );
};

export default StatusPage;
