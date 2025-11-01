'use client';

import { Button, Card } from '@repo/shared/ui';
import { Check, Copy } from 'lucide-react';

import { useApiKeyCopy } from '@/widgets/home';

interface ApiKeyCardProps {
  apiKey: string;
}

const ApiKeyCard = ({ apiKey }: ApiKeyCardProps) => {
  const { copied, handleCopy } = useApiKeyCopy(apiKey);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <code className="break-all font-mono text-sm">{apiKey}</code>
        </div>
        <Button size="icon" variant="outline" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default ApiKeyCard;
