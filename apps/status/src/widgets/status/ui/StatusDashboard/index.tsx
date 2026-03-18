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

const TONE_TEXT: Record<StatusTone, string> = {
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-destructive',
  warning: 'text-amber-600 dark:text-amber-400',
};

const TONE_FRAME: Record<
  StatusTone,
  {
    border: string;
    titleBg: string;
    titleText: string;
    contentBg: string;
    divider: string;
    cardBorder: string;
  }
> = {
  success: {
    border: 'border-emerald-500 dark:border-emerald-400',
    titleBg: 'bg-emerald-500 dark:bg-emerald-600',
    titleText: 'text-white/90',
    contentBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    divider: 'border-emerald-400/30 dark:border-emerald-500/30',
    cardBorder: 'border-emerald-400/50 dark:border-emerald-500/50',
  },
  error: {
    border: 'border-destructive',
    titleBg: 'bg-destructive',
    titleText: 'text-white/90',
    contentBg: 'bg-destructive/5',
    divider: 'border-destructive/20',
    cardBorder: 'border-destructive/40',
  },
  warning: {
    border: 'border-amber-500 dark:border-amber-400',
    titleBg: 'bg-amber-500 dark:bg-amber-600',
    titleText: 'text-white/90',
    contentBg: 'bg-amber-50/50 dark:bg-amber-950/20',
    divider: 'border-amber-400/30 dark:border-amber-500/30',
    cardBorder: 'border-amber-400/50 dark:border-amber-500/50',
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
  const frame = TONE_FRAME[overallStatus.tone];

  return (
    <>
      {/* Main terminal frame */}
      <div className={cn('w-full border-2 pixel-shadow', frame.border)}>
        {/* Terminal title bar */}
        <div
          className={cn(
            'flex items-center justify-between border-b-2 px-4 py-2',
            frame.border,
            frame.titleBg,
          )}
        >
          <span className={cn('font-mono text-xs uppercase tracking-widest', frame.titleText)}>
            STATUS TERMINAL
          </span>
          <button
            onClick={() => void refetch()}
            disabled={isChecking}
            className={cn(
              'flex items-center gap-1.5 border border-background/30 px-2 py-1 font-mono text-[10px] text-background transition-all',
              'hover:border-background hover:bg-background hover:text-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <RefreshCw className={cn('h-2.5 w-2.5', isChecking && 'animate-spin')} />
            {isChecking ? '확인 중...' : '새로고침'}
          </button>
        </div>

        {/* Overall status */}
        <div className={cn('p-4', frame.contentBg)}>
          <p className={cn('mb-3 text-xs uppercase tracking-widest text-muted-foreground font-mono')}>
            {'>'} OVERALL STATUS
          </p>
          <div className={cn('flex items-center gap-3')}>
            {overallStatus.tone === 'success' ? (
              <CheckCircle2 className={cn('h-5 w-5', TONE_TEXT.success)} />
            ) : overallStatus.tone === 'error' ? (
              <XCircle className={cn('h-5 w-5', TONE_TEXT.error)} />
            ) : (
              <Clock className={cn('h-5 w-5', TONE_TEXT.warning)} />
            )}
            <div>
              <span
                className={cn('font-pixel text-[10px] leading-[1.8]', TONE_TEXT[overallStatus.tone])}
              >
                {overallStatus.label}
              </span>
              {lastChecked && (
                <p
                  className={cn('font-mono text-xs text-muted-foreground')}
                  suppressHydrationWarning
                >
                  마지막 확인: {formatKoreanTime(lastChecked)}
                </p>
              )}
            </div>
          </div>
          {isError && (
            <p className={cn('mt-2 font-mono text-xs text-muted-foreground')}>
              {'// 최신 상태 조회에 실패했습니다. 마지막 정상 데이터를 표시 중입니다.'}
            </p>
          )}
        </div>

        {/* Server grid */}
        <div className={cn('border-t p-4', frame.contentBg, frame.divider)}>
          <p
            className={cn('mb-3 text-xs uppercase tracking-widest text-muted-foreground font-mono')}
          >
            {'>'} SERVERS
          </p>
          <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2')}>
            {servers.map((server) => {
              const statusMeta = SERVER_STATUS_META[server.status];
              const serverFrame = TONE_FRAME[statusMeta.tone];
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
                    'border p-3 transition-opacity',
                    serverFrame.cardBorder,
                    isChecking && 'opacity-50',
                  )}
                >
                  <div className={cn('mb-2 flex items-center justify-between')}>
                    <h3 className={cn('font-mono text-sm font-medium')}>{server.name}</h3>
                    <div className={cn('flex items-center gap-1.5')}>
                      <StatusIcon
                        className={cn('h-3.5 w-3.5', TONE_TEXT[statusMeta.tone])}
                      />
                      <span
                        className={cn(
                          'font-mono text-xs uppercase tracking-wide',
                          TONE_TEXT[statusMeta.tone],
                        )}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>
                  <p className={cn('font-mono text-xs text-muted-foreground')}>
                    {server.description}
                  </p>
                  {server.responseTime !== undefined && (
                    <p className={cn('mt-1 font-mono text-xs text-muted-foreground/60')}>
                      {server.responseTime}ms
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status legend */}
      <div className={cn('mt-4 border border-foreground/25 p-3')}>
        <p
          className={cn('mb-2 text-xs uppercase tracking-widest text-muted-foreground font-mono')}
        >
          {'>'} 상태 안내
        </p>
        <div className={cn('flex gap-6')}>
          <div className={cn('flex items-center gap-1.5')}>
            <CheckCircle2 className={cn('h-3.5 w-3.5', TONE_TEXT.success)} />
            <span className={cn('font-mono text-xs')}>정상</span>
          </div>
          <div className={cn('flex items-center gap-1.5')}>
            <Clock className={cn('h-3.5 w-3.5', TONE_TEXT.warning)} />
            <span className={cn('font-mono text-xs')}>배포 중</span>
          </div>
          <div className={cn('flex items-center gap-1.5')}>
            <XCircle className={cn('h-3.5 w-3.5', TONE_TEXT.error)} />
            <span className={cn('font-mono text-xs')}>장애</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusDashboard;
