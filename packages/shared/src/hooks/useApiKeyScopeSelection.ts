'use client';

import { useMemo } from 'react';

import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { ApiKeyFormType, AvailableScopeListResponse } from '../types';

interface UseApiKeyScopeSelectionParams {
  availableScopes?: AvailableScopeListResponse;
  watch: UseFormWatch<ApiKeyFormType>;
  setValue: UseFormSetValue<ApiKeyFormType>;
}

export const useApiKeyScopeSelection = ({
  availableScopes,
  watch,
  setValue,
}: UseApiKeyScopeSelectionParams) => {
  const fieldName = 'scopes';

  const scopeMap = useMemo(() => {
    const map = new Map<string, string[]>();
    const categories = availableScopes?.data?.list || [];

    categories.forEach((category) => {
      category.scopes?.forEach(({ scope }) => {
        if (scope.endsWith(':*')) return;
        const prefix = scope.split(':')[0];
        map.set(prefix!, [...(map.get(prefix!) ?? []), scope]);
      });
    });

    return map;
  }, [availableScopes]);

  const handleScopeToggle = (scope: string) => {
    const currentScopes = watch(fieldName) || [];

    if (scope.endsWith(':*')) {
      const prefix = scope.split(':')[0];
      const relatedScopes = scopeMap.get(prefix!) ?? [];

      const allSelected =
        relatedScopes.length > 0 && relatedScopes.every((id) => currentScopes.includes(id));

      const nextSelected = allSelected
        ? currentScopes.filter((id) => !relatedScopes.includes(id))
        : Array.from(new Set([...currentScopes, ...relatedScopes]));

      setValue(fieldName, nextSelected, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }

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

    if (scope.endsWith(':*')) {
      const prefix = scope.split(':')[0];
      const relatedScopes = scopeMap.get(prefix!) ?? [];

      return relatedScopes.length > 0 && relatedScopes.every((id) => currentScopes.includes(id));
    }

    return currentScopes.includes(scope);
  };

  const getIndentation = (level: string) => {
    if (level.includes(':*')) return 'pl-0';
    return 'pl-6';
  };

  return {
    handleScopeToggle,
    isScopeChecked,
    getIndentation,
  };
};
