'use client';

import { useMemo } from 'react';

import { cn } from '@repo/shared/utils';
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
    text: 'text-foreground',
    bg: 'bg-foreground/5',
    border: 'border-foreground/25',
  },
  error: {
    text: 'text-destructive',
    bg: 'bg-destructive/5',
    border: 'border-destructive/30',
  },
  warning: {
    text: 'text-muted-foreground',
    bg: 'bg-muted',
    border: 'border-foreground/20',
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
      <div
        className={cn(
          'mb-6 border-2 p-6',
          overallToneStyles.border,
          overallToneStyles.bg,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {overallStatus.tone === 'success' ? (
              <CheckCircle2 className={cn('h-6 w-6', overallToneStyles.text)} />
            ) : overallStatus.tone === 'error' ? (
              <XCircle className={cn('h-6 w-6', overallToneStyles.text)} />
            ) : (
              <Clock className={cn('h-6 w-6', overallToneStyles.text)} />
            )}
            <div>
              <h2 className={cn('font-pixel text-[10px] leading-[1.8]', overallToneStyles.text)}>
                {overallStatus.label}
              </h2>
              {lastChecked && (
                <p className="text-muted-foreground font-mono text-xs">
                  마지막 확인: {formatKoreanTime(lastChecked)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => void refetch()}
            disabled={isChecking}
            className={cn(
              'flex items-center gap-2 border border-foreground/30 px-3 py-1.5 font-mono text-xs transition-all',
              'hover:border-foreground hover:bg-foreground hover:text-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <RefreshCw className={cn('h-3 w-3', isChecking && 'animate-spin')} />
            {isChecking ? '확인 중...' : '새로고침'}
          </button>
        </div>
        {isError && (
          <p className="text-muted-foreground mt-2 font-mono text-xs">
            최신 상태 조회에 실패했습니다. 마지막 정상 데이터를 표시 중입니다.
          </p>
        )}
      </div>

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
            <div
              key={server.name}
              className={cn(
                'border p-4 transition-opacity',
                statusToneStyles.border,
                isChecking && 'opacity-50',
              )}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={cn('border p-1.5', statusToneStyles.border, statusToneStyles.bg)}>
                    <StatusIcon className={cn('h-4 w-4', statusToneStyles.text)} />
                  </div>
                  <div className="text-right">
                    <span className={cn('font-mono text-xs font-medium', statusToneStyles.text)}>
                      {statusMeta.label}
                    </span>
                    {server.responseTime !== undefined && (
                      <p className="text-muted-foreground font-mono text-xs">
                        {server.responseTime}ms
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-mono font-medium">{server.name}</h3>
                  <p className="text-muted-foreground font-mono text-xs">{server.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border border-foreground/25 p-4">
        <h3 className="mb-3 font-pixel text-[9px] leading-[1.8]">상태 안내</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />
            <span className="font-mono text-xs">정상</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-mono text-xs">배포 중</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-3.5 w-3.5 text-destructive" />
            <span className="font-mono text-xs">장애</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusDashboard;
