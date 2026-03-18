'use client';

import { useMemo } from 'react';

import { Button, Card } from '@repo/shared/ui';
import { CheckCircle2, Clock, RefreshCw, XCircle } from 'lucide-react';

import {
  type HealthStatusData,
  SERVER_STATUS_META,
  type StatusTone,
  getOverallStatus,
  useGetHealthStatus,
} from '@/entities/status';
import { formatKoreanTime } from '@/shared/lib/date/formatKoreanTime';

const TONE_STYLES: Record<
  StatusTone,
  {
    text: string;
    bg: string;
    border: string;
  }
> = {
  success: {
    text: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800',
  },
  error: {
    text: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800',
  },
  warning: {
    text: 'text-amber-600',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800',
  },
};

interface StatusDashboardProps {
  initialHealthStatus: HealthStatusData;
}

const StatusDashboard = ({ initialHealthStatus }: StatusDashboardProps) => {
  const { data, refetch, isFetching, isError } = useGetHealthStatus({
    initialData: initialHealthStatus,
  });

  const servers = data.servers;
  const isChecking = isFetching;
  const lastChecked = useMemo(() => new Date(data.checkedAt), [data.checkedAt]);

  const overallStatus = useMemo(() => getOverallStatus(servers), [servers]);
  const overallToneStyles = TONE_STYLES[overallStatus.tone];

  return (
    <>
      <Card className={`mb-6 p-6 ${overallToneStyles.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {overallStatus.tone === 'success' ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : overallStatus.tone === 'error' ? (
              <XCircle className="h-8 w-8 text-red-600" />
            ) : (
              <Clock className="h-8 w-8 text-amber-600" />
            )}
            <div>
              <h2 className={`text-xl font-semibold ${overallToneStyles.text}`}>
                {overallStatus.label}
              </h2>
              {lastChecked && (
                <p className="text-muted-foreground text-sm">
                  마지막 확인: {formatKoreanTime(lastChecked)}
                </p>
              )}
            </div>
          </div>
          <Button onClick={() => void refetch()} disabled={isChecking} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? '확인 중...' : '새로고침'}
          </Button>
        </div>
        {isError && (
          <p className="text-muted-foreground mt-2 text-xs">
            최신 상태 조회에 실패했습니다. 마지막 정상 데이터를 표시 중입니다.
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {servers.map((server) => {
          const statusMeta = SERVER_STATUS_META[server.status];
          const statusToneStyles = TONE_STYLES[statusMeta.tone];
          const StatusIcon =
            statusMeta.tone === 'success'
              ? CheckCircle2
              : statusMeta.tone === 'error'
                ? XCircle
                : Clock;

          return (
            <Card
              key={server.name}
              className={`border p-4 ${statusToneStyles.border} ${isChecking ? 'opacity-50' : ''}`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={`rounded-full p-2 ${statusToneStyles.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${statusToneStyles.text}`} />
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${statusToneStyles.text}`}>
                      {statusMeta.label}
                    </span>
                    {server.responseTime !== undefined && (
                      <p className="text-muted-foreground text-xs">{server.responseTime}ms</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{server.name}</h3>
                  <p className="text-muted-foreground text-sm">{server.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-4">
        <h3 className="mb-3 text-sm font-semibold">상태 안내</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm">정상</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm">배포 중</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm">장애</span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default StatusDashboard;
