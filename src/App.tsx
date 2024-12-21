import React, { useCallback, useMemo } from "react";
import {
  Diary,
  DiaryEntry,
  Ingredient,
  IngredientLibrary,
  Meal,
} from "./types";
import DiaryPageView from "./DiaryPage";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { formatDate, recipeToIngredient } from "./util";
import { useDiaryStorage } from "./useLocalStorage";
import WeightChartView from "./WeightChartView";
import DebugViewContainer from "./DebugViewContainer";
import MealImportContainer from "./MealImportContainer";
import useEditDiary from "./useEditDiary";

export default function App() {
  const [diary, setDiary, error] = useDiaryStorage();

  return (
    <Routes>
      {!!diary && (
        <>
          <Route
            path="diary/:date/*"
            element={
              <DiaryPageViewContainer diary={diary} setDiary={setDiary} />
            }
          />
          <Route path="chart" element={<WeightChartView diary={diary} />} />
          <Route
            path="import/meal"
            element={<MealImportContainer diary={diary} setDiary={setDiary} />}
          />
        </>
      )}
      <Route
        path="/diary"
        element={<Navigate to={`${formatDate(new Date())}`} replace={true} />}
      />
      <Route path="/debug" element={<DebugViewContainer error={error} />} />
      <Route path="/" element={<Navigate to={!!diary ? "diary" : "debug"} />} />
    </Routes>
  );
}

function DiaryPageViewContainer({
  diary,
  setDiary,
}: {
  diary: Diary;
  setDiary: (newDiary: Diary) => void;
}) {
  const { date: dateParams } = useParams();

  const { setPoop, setPeriod } = useEditDiary(diary, setDiary);

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

    const setWeight = (newWeight: number) => {
      console.log("setting weight");
      setDiary({
        ...diary,
        [formattedDate]: { ...diaryEntry, weight: newWeight },
      });
    };

    const setMeals = (newMeals: Meal[]) => {
      console.log("setting meals");
      setDiary({
        ...diary,
        [formattedDate]: { ...diaryEntry, meals: newMeals },
      });
    };

    return { date, diaryEntry, formattedDate, setWeight, setMeals };
  }, [dateParams, diary, setDiary]);

  const ingredientLibrary = useMemo(() => {
    let library: IngredientLibrary = {};

    for (const entry of Object.values(diary)) {
      for (const meal of entry.meals) {
        if (meal.imported) {
          // Skip imported meals
          continue;
        }
        for (const component of meal.recipe.components) {
          library[component.ingredient.id] = component.ingredient;
        }
        if (meal.recipe.id !== meal.recipe.components[0]?.ingredient.id) {
          library[meal.recipe.id] = recipeToIngredient(meal.recipe);
        }
      }
    }

    return library;
  }, [diary]);

  if (!pageData) {
    return <div>NotFound</div>;
  }

  return (
    <DiaryPageView
      IngredientLibrary={ingredientLibrary}
      entry={pageData.diaryEntry}
      key={pageData.formattedDate}
      meals={pageData.diaryEntry.meals}
      weight={pageData.diaryEntry.weight}
      setWeight={pageData.setWeight}
      setMeals={pageData.setMeals}
      setPoop={(poop) => setPoop(pageData.date, poop)}
      setPeriod={(period) => setPeriod(pageData.date, period)}
      date={pageData.date}
    />
  );
}
