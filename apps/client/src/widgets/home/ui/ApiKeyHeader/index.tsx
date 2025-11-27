import { cn } from '@repo/shared/utils';
import { Key } from 'lucide-react';

const ApiKeyHeader = () => {
  return (
    <div className={cn('mb-8 text-center')}>
      <div
        className={cn(
          'bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full',
        )}
      >
        <Key className={cn('text-primary h-8 w-8')} />
      </div>
      <h1 className={cn('text-3xl font-bold')}>API Key</h1>
    </div>
  );
};

export default ApiKeyHeader;
