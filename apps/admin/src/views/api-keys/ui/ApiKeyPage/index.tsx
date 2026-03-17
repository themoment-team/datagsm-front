'use client';

import { useEffect, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useURLFilters } from '@repo/shared/hooks';
import { CommonPagination } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

const pixelStyle = { fontFamily: '"Press Start 2P", monospace' };
const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };
import { useForm, useWatch } from 'react-hook-form';

import { ApiKeyFilterSchema, ApiKeyFilterType } from '@/entities/api-key';
import { useGetApiKeys } from '@/views/api-keys';
import { ApiKeyFilter, ApiKeyFormDialog, ApiKeyList } from '@/widgets/api-keys';

const PAGE_SIZE = 10;

const ApiKeyPage = () => {
  const searchParams = useSearchParams();
  const { updateURL } = useURLFilters<ApiKeyFilterType>();

  const initialValues = useMemo(
    (): ApiKeyFilterType & { page: number } => ({
      id: searchParams.get('id') || '',
      accountId: searchParams.get('accountId') || '',
      scope: searchParams.get('scope') || '',
      isExpired: (searchParams.get('isExpired') as ApiKeyFilterType['isExpired']) || 'all',
      isRenewable: (searchParams.get('isRenewable') as ApiKeyFilterType['isRenewable']) || 'all',
      page: Number(searchParams.get('page')) || 0,
    }),
    [searchParams],
  );

  const form = useForm<ApiKeyFilterType>({
    resolver: zodResolver(ApiKeyFilterSchema),
    defaultValues: {
      id: initialValues.id,
      accountId: initialValues.accountId,
      scope: initialValues.scope,
      isExpired: initialValues.isExpired,
      isRenewable: initialValues.isRenewable,
    },
  });

  const { control } = form;

  const filters = useWatch({
    control,
  });

  const currentPage = initialValues.page;

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasChanged =
        filters.id !== initialValues.id ||
        filters.accountId !== initialValues.accountId ||
        filters.scope !== initialValues.scope ||
        filters.isExpired !== initialValues.isExpired ||
        filters.isRenewable !== initialValues.isRenewable;

      if (hasChanged) {
        updateURL(filters, 0);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, initialValues, updateURL]);

  const handlePageChange = (page: number) => {
    updateURL(filters, page);
  };

  const queryParams = {
    page: currentPage,
    size: PAGE_SIZE,
    id: filters.id ? Number(filters.id) : undefined,
    accountId: filters.accountId ? Number(filters.accountId) : undefined,
    scope: filters.scope || undefined,
    isExpired: filters.isExpired === 'all' ? undefined : filters.isExpired === 'true',
    isRenewable: filters.isRenewable === 'all' ? undefined : filters.isRenewable === 'true',
  };

  const { data: apiKeysData, isLoading: isLoadingApiKeys } = useGetApiKeys(queryParams);

  const apiKeys = apiKeysData?.data.apiKeys;
  const totalPages = apiKeysData?.data.totalPages ?? 0;

  return (
    <div className={cn('bg-background min-h-[calc(100vh-3.5rem)]')}>
      <main className={cn('container mx-auto px-4 py-8')}>
        {/* Page header */}
        <div className={cn('mb-6 flex items-end justify-between border-b-2 border-foreground pb-4')}>
          <div>
            <p className={cn('mb-2 text-xs uppercase tracking-widest text-muted-foreground')} style={monoStyle}>
              DATAGSM / Admin
            </p>
            <h1 className={cn('text-foreground leading-tight')} style={{ ...pixelStyle, fontSize: '15px' }}>
              API Key 관리
            </h1>
          </div>
          <ApiKeyFormDialog userRole="ADMIN" />
        </div>

        {/* Filters */}
        <div className={cn('mb-4')}>
          <ApiKeyFilter control={control} />
        </div>

        {/* Table */}
        <div className={cn('border-2 border-foreground')} style={{ boxShadow: '4px 4px 0 0 oklch(0.04 0 0)' }}>
          <ApiKeyList apiKeys={apiKeys} isLoading={isLoadingApiKeys} />
        </div>

        <div className={cn('mt-5')}>
          <CommonPagination
            isLoading={isLoadingApiKeys}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
};

export default ApiKeyPage;
