import { useState } from 'react';

import { toast } from 'sonner';

interface UseCopyToClipboardOptions {
  duration?: number;
  successMessage?: string;
}

export const useCopyToClipboard = (options?: UseCopyToClipboardOptions) => {
  const { duration = 2000, successMessage = '복사되었습니다.' } = options || {};

  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), duration);
    } catch (error) {
      toast.error('복사에 실패했습니다.');
      console.error('Copy to clipboard failed:', error);
    }
  };

  return { copied, copy };
};
