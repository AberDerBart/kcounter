import { useCallback, useEffect, useState } from "react";
import {
  Diary,
  DiaryV2,
  IngredientLibrary,
  RecipeLibrary,
  Settings,
} from "./types";
import deepEqual from "deep-equal";

export function useDiaryStorage() {
  return useLocalStorageState<Diary>("diary", {}, Diary.parse);
}

export function useDiaryV2Storage() {
  return useLocalStorageState<DiaryV2>("diaryV2", {}, DiaryV2.parse);
}

export function useRecipeStorage() {
  return useLocalStorageState<RecipeLibrary>(
    "recipes",
    {},
    RecipeLibrary.parse,
  );
}

export function useIngredientStorage() {
  return useLocalStorageState<IngredientLibrary>(
    "ingredients",
    {},
    IngredientLibrary.parse,
  );
}

export function useSettingsStorage() {
  return useLocalStorageState<Settings>("settings", {}, Settings.parse);
}

function useLocalStorageState<S>(
  key: string,
  defaultValue: S,
  parse: (raw: unknown) => S,
): [S, (newState: S) => void, unknown] {
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
      return defaultValue;
    }
  }, [defaultValue, key, parse]);

  const [value, setValue] = useState<S>(getValueFromLocalStorage);

  const setAndSave = useCallback(
    (newValue: S) => {
      if (error) {
        console.error(
          "[useLocalStorageState]",
          "setAndSave",
          "wont save due to error",
        );
        return;
      }
      console.log("[useLocalStorageState]", "setAndSave", key, newValue);
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [error, key],
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
