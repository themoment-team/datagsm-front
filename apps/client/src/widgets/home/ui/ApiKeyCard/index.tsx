'use client';

import { useState } from 'react';

import { Button, Card } from '@repo/shared/ui';
import { Check, Copy, RefreshCw } from 'lucide-react';

import { useApiKeyCopy } from '@/widgets/home';

const ApiKeyCard = () => {
  const mockApiKey = '123e4567-e89b-12d3-a456-426614174000';
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const { copied, handleCopy } = useApiKeyCopy(mockApiKey);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <code className="break-all font-mono text-sm">{mockApiKey}</code>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="icon" variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyCard;
