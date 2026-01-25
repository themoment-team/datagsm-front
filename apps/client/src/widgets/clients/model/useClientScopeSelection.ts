import { useMemo } from 'react';

import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { AvailableScopesResponse, ClientFormType } from '@/entities/clients';

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
  const scopeMap = useMemo(() => {
    const map = new Map<string, string[]>();

    const categories = availableScopes?.data?.list || [];
    categories.forEach((category) => {
      category.scopes.forEach(({ scope }) => {
        if (scope.endsWith(':*')) return;

        const prefix = scope.split(':')[0];
        map.set(prefix!, [...(map.get(prefix!) ?? []), scope]);
      });
    });

    return map;
  }, [availableScopes]);

  const handleScopeToggle = (scope: string) => {
    const currentScopes = watch('scopes');

    // 전체 scope 선택
    if (scope.endsWith(':*')) {
      const prefix = scope.split(':')[0];
      const relatedScopes = scopeMap.get(prefix!) ?? [];

      const allSelected =
        relatedScopes.length > 0 && relatedScopes.every((id) => currentScopes.includes(id));

      const nextSelected = allSelected
        ? currentScopes.filter((id) => !relatedScopes.includes(id))
        : Array.from(new Set([...currentScopes, ...relatedScopes]));

      setValue('scopes', nextSelected, { shouldValidate: true });
      return;
    }

    // 일반 scope 단일 토글
    setValue(
      'scopes',
      currentScopes.includes(scope)
        ? currentScopes.filter((id) => id !== scope)
        : [...currentScopes, scope],
      { shouldValidate: true },
    );
  };

  const isScopeChecked = (scope: string) => {
    const currentScopes = watch('scopes');

    // 전체 scope일 경우 하위 scope 탐색
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
