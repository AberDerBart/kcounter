import { useCallback, useEffect, useState } from "react";
import { Diary } from "./types";
import deepEqual from "deep-equal";

export default function useDiaryStorage() {
  return useLocalStorageState<Diary>("diary", {});
}

function useLocalStorageState<S>(
  key: string,
  defaultValue: S
): [S, (newState: S) => void] {
  const getValueFromLocalStorage = useCallback(() => {
    const itemString = localStorage.getItem(key);
    if (!itemString) {
      return defaultValue;
    }

    return JSON.parse(itemString) as S;
  }, [defaultValue, key]);

  const [value, setValue] = useState<S>(getValueFromLocalStorage);

  const setAndSave = useCallback(
    (newValue: S) => {
      console.log("[useLocalStorageState]", "setAndSave", key, newValue);
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === key) {
        const localStorageValue = getValueFromLocalStorage();
        // Only call setter if value from localStorage is actually different from current value to
        // keep value referential identical and avoid unneeded effect runs
        if (!deepEqual(localStorageValue, value)) {
          setValue(localStorageValue);
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [getValueFromLocalStorage, key, value]);

  return [value, setAndSave];
}
