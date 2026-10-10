import { useCallback, useMemo } from "react";
import {
  DiaryEntry,
} from "../types";
import DiaryPageView from "../DiaryPageView";
import { useParams } from "react-router-dom";
import { formatDate } from "../util";
import { useDiaryStorage, useIngredientStorage, useRecipeStorage, useSettingsStorage } from "../useLocalStorage";

export default function DiaryPageViewContainer() {
  const [diary, setDiary] = useDiaryStorage();
  const [recipes] = useRecipeStorage();
  const [ingredients] = useIngredientStorage();
  const [settings] = useSettingsStorage();
  const { date: dateParams } = useParams();

  const pageData = useMemo(() => {
    if (!dateParams) {
      return undefined;
    }

    const date = new Date(dateParams);

    if (isNaN(date.getTime())) {
      return undefined;
    }

    const formattedDate = formatDate(date);

    const diaryEntry: DiaryEntry = diary[formattedDate] ?? { meals: [] };

    return { date, diaryEntry, formattedDate, };
  }, [dateParams, diary]);

  const setEntry = useCallback((entry: DiaryEntry) => {
    if (!dateParams) {
      return;
    }
    setDiary({
      ...diary, [dateParams]: entry
    });
  }, [dateParams, diary, setDiary]);

  if (!pageData) {
    return <div>NotFound</div>;
  }

  return (
    <DiaryPageView
      date={pageData.date}
      ingredients={ingredients}
      recipes={recipes}
      entry={pageData.diaryEntry}
      setEntry={setEntry}
      key={pageData.formattedDate}
      settings={settings}
    />
  );
}
