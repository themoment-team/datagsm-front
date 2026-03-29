'use client';

import { cn } from '@repo/shared/utils';

const ApiKeyHeader = () => {
  return (
    <div className={cn('mb-10 text-center')}>
      {/* Pixel grid decoration */}
      <div className={cn('mb-6 inline-flex items-center justify-center gap-1')}>
        {[
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1],
        ].map((row, ri) => (
          <div key={ri} className={cn('flex flex-col gap-1')}>
            {row.map((filled, ci) => (
              <div
                key={ci}
                className={cn('h-3 w-3', filled ? 'bg-foreground' : 'border-2 border-foreground')}
              />
            ))}
          </div>
        ))}
        <div className={cn('mx-3 h-px w-8 bg-foreground')} />
        <div
          className={cn('text-foreground font-pixel text-[18px] leading-none')}
        >
          API
        </div>
        <div className={cn('mx-3 h-px w-8 bg-foreground')} />
        {[
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1],
        ].map((row, ri) => (
          <div key={ri} className={cn('flex flex-col gap-1')}>
            {row.map((filled, ci) => (
              <div
                key={ci}
                className={cn('h-3 w-3', filled ? 'bg-foreground' : 'border-2 border-foreground')}
              />
            ))}
          </div>
        ))}
      </div>

      <h1
        className={cn('text-foreground block font-pixel text-[22px] leading-[1.6]')}
      >
        KEY
      </h1>

      <p
        className={cn('mt-3 text-xs text-muted-foreground font-mono')}
      >
        {'>'} DataGSM API 접근 인증 키 관리
      </p>
    </div>
  );
};

export default ApiKeyHeader;
