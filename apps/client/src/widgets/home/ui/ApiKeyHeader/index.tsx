import { Key } from 'lucide-react';

const ApiKeyHeader = () => {
  return (
    <div className="mb-8 text-center">
      <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
        <Key className="text-primary h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold">API Key</h1>
    </div>
  );
};

export default ApiKeyHeader;
