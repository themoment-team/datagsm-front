'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button, Card } from '@repo/shared/ui';
import { CheckCircle2, Clock, RefreshCw, XCircle } from 'lucide-react';

import {
  HEALTH_CHECK_STATUS_POOL,
  INITIAL_SERVERS,
  SERVER_STATUS_META,
  type Server,
  type ServerStatus,
  type StatusTone,
  getOverallStatus,
  hasDeployingServer,
  hasDownServer,
  isAllOperational,
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

const pickRandomStatus = () => {
  const randomIndex = Math.floor(Math.random() * HEALTH_CHECK_STATUS_POOL.length);
  return HEALTH_CHECK_STATUS_POOL[randomIndex] as ServerStatus;
};

const StatusDashboard = () => {
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = () => {
    setIsChecking(true);

    setTimeout(() => {
      const updatedServers = INITIAL_SERVERS.map((server) => {
        const randomStatus = pickRandomStatus();
        return {
          ...server,
          status: randomStatus,
          responseTime: randomStatus === 200 ? Math.floor(Math.random() * 100) + 20 : undefined,
        };
      });

      setServers(updatedServers);
      setLastChecked(new Date());
      setIsChecking(false);
    }, 1500);
  };

  useEffect(() => {
    setLastChecked(new Date());
  }, []);

  const allOperational = useMemo(() => isAllOperational(servers), [servers]);
  const hasDown = useMemo(() => hasDownServer(servers), [servers]);
  const hasDeploying = useMemo(() => hasDeployingServer(servers), [servers]);
  const overallStatus = useMemo(() => getOverallStatus(servers), [servers]);
  const overallToneStyles = TONE_STYLES[overallStatus.tone];

  return (
    <>
      <Card className={`mb-6 p-6 ${overallToneStyles.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {allOperational ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : hasDown ? (
              <XCircle className="h-8 w-8 text-red-600" />
            ) : hasDeploying ? (
              <Clock className="h-8 w-8 text-amber-600" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
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
          <Button onClick={checkHealth} disabled={isChecking} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? '확인 중...' : '새로고침'}
          </Button>
        </div>
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
