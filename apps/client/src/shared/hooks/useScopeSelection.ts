import { useMemo } from 'react';

import { FieldValues, Path, PathValue, UseFormSetValue, UseFormWatch } from 'react-hook-form';

export interface ScopeItem {
  scope: string;
  description?: string;
}

export interface ScopeCategory {
  title: string;
  scopes: ScopeItem[];
}

export interface ScopeSelectionData {
  data?: {
    list: ScopeCategory[];
  };
}

interface UseScopeSelectionParams<T extends FieldValues> {
  availableScopes?: ScopeSelectionData;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  fieldName: Path<T>;
}

export const useScopeSelection = <T extends FieldValues>({
  availableScopes,
  watch,
  setValue,
  fieldName,
}: UseScopeSelectionParams<T>) => {
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
    const currentScopes = (watch(fieldName) as string[]) || [];

    // 전체 scope 선택
    if (scope.endsWith(':*')) {
      const prefix = scope.split(':')[0];
      const relatedScopes = scopeMap.get(prefix!) ?? [];

      const allSelected =
        relatedScopes.length > 0 && relatedScopes.every((id) => currentScopes.includes(id));

      const nextSelected = allSelected
        ? currentScopes.filter((id) => !relatedScopes.includes(id))
        : Array.from(new Set([...currentScopes, ...relatedScopes]));

      setValue(fieldName, nextSelected as PathValue<T, Path<T>>, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }

    // 일반 scope 단일 토글
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
