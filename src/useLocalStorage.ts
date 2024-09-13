import { useCallback, useEffect, useState } from "react";
import { Diary, IngredientLibrary } from "./types";
import deepEqual from "deep-equal";

export function useDiaryStorage() {
  return useLocalStorageState<Diary>("diary", {}, Diary.parse);
}

export function useIngredientLibraryStorage() {
  return useLocalStorageState<IngredientLibrary>(
    "ingredientLibrary",
    {},
    IngredientLibrary.parse
  );
}

function useLocalStorageState<S>(
  key: string,
  defaultValue: S,
  parse: (raw: unknown) => S
): [S | undefined, (newState: S) => void, unknown | undefined] {
  const [error, setError] = useState<unknown | undefined>();
  const getValueFromLocalStorage = useCallback(() => {
    try {
      const itemString = localStorage.getItem(key);
      if (!itemString) {
        return defaultValue;
      }

      return parse(JSON.parse(itemString));
    } catch (e) {
      setError(e);
      console.error(e);
      return undefined;
    }
  }, [defaultValue, key, parse]);

  const [value, setValue] = useState<S | undefined>(getValueFromLocalStorage);

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

  return [value, setAndSave, error];
}
