import { headers } from 'next/headers';

import { fetchHealthStatus } from '@/entities/status';
import { StatusPage } from '@/views/status';

const resolveBaseOrigin = async () => {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host');

  if (!host) {
    return undefined;
  }

  const protocol =
    headerStore.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
};

const Status = async () => {
  const baseOrigin = await resolveBaseOrigin();
  const [initialHealthStatus] = await Promise.all([fetchHealthStatus({ baseOrigin })]);

  return <StatusPage initialHealthStatus={initialHealthStatus} />;
};

export default Status;
