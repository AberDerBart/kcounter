import { useCallback, useEffect, useState } from "react";

export interface MultiSelect {
  selectedIds: Set<string>;
  select: (id: string) => void;
  deselect: (id: string) => void;
  setSelected: (id: string, selected: boolean) => void;
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  clear: () => void;
}

export default function useMultiSelect(applicableIds: string[]): MultiSelect {
  const [enabled, setEnabled] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedIds(selectedIds.intersection(new Set(applicableIds)));
  }, [applicableIds, selectedIds]);

  useEffect(() => {
    if (selectedIds.size > 0 && !enabled) {
      setSelectedIds(new Set());
    }
  }, [enabled, selectedIds.size]);

  const select = useCallback(
    (id: string) =>
      setSelectedIds((s) => {
        const updated = new Set(s);
        updated.add(id);
        return updated;
      }),
    [],
  );

  const deselect = useCallback(
    (id: string) =>
      setSelectedIds((s) => {
        const updated = new Set(s);
        updated.delete(id);
        return updated;
      }),
    [],
  );

  const setSelected = useCallback(
    (id: string, selected: boolean) => {
      if (selected) {
        select(id);
      } else {
        deselect(id);
      }
    },
    [deselect, select],
  );

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  return {
    selectedIds,
    select,
    deselect,
    setSelected,
    enabled,
    setEnabled,
    clear,
  };
}
