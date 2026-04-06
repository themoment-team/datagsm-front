'use client';

import { useMemo } from 'react';

import { FieldValues, Path, PathValue, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { ClientAvailableScope, ClientAvailableScopesResponse } from '../types';

interface UseClientScopeSelectionParams<T extends FieldValues> {
  availableScopes?: ClientAvailableScopesResponse;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  fieldName: Path<T>;
}

export const useClientScopeSelection = <T extends FieldValues>({
  availableScopes,
  watch,
  setValue,
  fieldName,
}: UseClientScopeSelectionParams<T>) => {
  const groupedScopes = useMemo(() => {
    const list = availableScopes?.data?.list || [];
    const groups: Record<string, ClientAvailableScope[]> = {};

    list.forEach((item) => {
      if (!item || !item.applicationName) return;

      if (!groups[item.applicationName]) {
        groups[item.applicationName] = [];
      }
      groups[item.applicationName].push(item);
    });

    return groups;
  }, [availableScopes]);

  const handleScopeToggle = (scope: string) => {
    const currentScopes = (watch(fieldName) as string[]) || [];

    setValue(
      fieldName,
      (currentScopes.includes(scope)
        ? currentScopes.filter((id) => id !== scope)
        : [...currentScopes, scope]) as PathValue<T, Path<T>>,
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const isScopeChecked = (scope: string) => {
    const currentScopes = (watch(fieldName) as string[]) || [];

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
