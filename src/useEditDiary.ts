import { useCallback } from "react";
import { Diary, DiaryEntry, Meal } from "./types";
import { formatDate } from "./util";

export default function useEditDiary(
  diary: Diary,
  setDiary: (diary: Diary) => void
) {
  const setEntry = useCallback(
    (date: Date, entry: DiaryEntry) => {
      setDiary({ ...diary, [formatDate(date)]: entry });
    },
    [diary, setDiary]
  );

  const modifyEntry = useCallback(
    (date: Date, mod: (old: DiaryEntry) => DiaryEntry) => {
      const formattedDate = formatDate(date);
      const oldEntry: DiaryEntry = (diary[formattedDate] as
        | DiaryEntry
        | undefined) ?? { meals: [] };
      setEntry(date, mod(oldEntry));
    },
    [diary, setEntry]
  );

  const addMeal = useCallback(
    (date: Date, meal: Meal) => {
      modifyEntry(date, (old: DiaryEntry) => ({
        ...old,
        meals: [...old.meals, meal],
      }));
    },
    [modifyEntry]
  );

  const setPoop = useCallback(
    (date: Date, poop: boolean) => {
      modifyEntry(date, (old) => ({ ...old, poop }));
    },
    [modifyEntry]
  );

  return {
    setEntry,
    addMeal,
    setPoop,
  };
}
