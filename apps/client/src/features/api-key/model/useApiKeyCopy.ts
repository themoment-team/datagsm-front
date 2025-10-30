import { useState } from 'react';

export const useApiKeyCopy = (apiKey: string) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy API key:', error);
    }
  };

  return {
    copied,
    handleCopy,
  };
};
