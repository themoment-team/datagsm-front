'use client';

import { useMemo } from 'react';

import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { ClientAvailableScope, AvailableScopesResponse, ClientFormType } from '@/entities/clients';

interface UseClientScopeSelectionParams {
  availableScopes?: AvailableScopesResponse;
  watch: UseFormWatch<ClientFormType>;
  setValue: UseFormSetValue<ClientFormType>;
}

export const useClientScopeSelection = ({
  availableScopes,
  watch,
  setValue,
}: UseClientScopeSelectionParams) => {
  const fieldName = 'scopes';

  const groupedScopes = useMemo(() => {
    const list = availableScopes?.data?.list || [];
    const groups: Record<string, ClientAvailableScope[]> = {};

    list.forEach((item) => {
      if (!item || !item.applicationName) return;

      const applicationName = item.applicationName;
      if (!groups[applicationName]) {
        groups[applicationName] = [];
      }
      groups[applicationName]!.push(item);
    });

    return groups;
  }, [availableScopes]);

  const handleScopeToggle = (scope: string) => {
    const currentScopes = watch(fieldName) || [];

    setValue(
      fieldName,
      currentScopes.includes(scope)
        ? currentScopes.filter((id) => id !== scope)
        : [...currentScopes, scope],
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const isScopeChecked = (scope: string) => {
    const currentScopes = watch(fieldName) || [];

    return currentScopes.includes(scope);
  };

  const getIndentation = () => {
    return 'pl-6';
  };

  return {
    groupedScopes,
    handleScopeToggle,
    isScopeChecked,
    getIndentation,
  };
};
