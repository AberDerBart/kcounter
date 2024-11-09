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

  const addMeal = useCallback(
    (date: Date, meal: Meal) => {
      const formattedDate = formatDate(date);
      const oldEntry: DiaryEntry = (diary[formattedDate] as
        | DiaryEntry
        | undefined) ?? { meals: [] };
      setEntry(date, { ...oldEntry, meals: [...oldEntry.meals, meal] });
    },
    [diary, setEntry]
  );

  return {
    setEntry,
    addMeal,
  };
}
