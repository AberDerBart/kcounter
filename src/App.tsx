import React, { useMemo } from "react";
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
import {
  useDiaryStorage,
  useIngredientLibraryStorage,
} from "./useLocalStorage";
import WeightChartView from "./WeightChartView";

export default function App() {
  const [diary, setDiary] = useDiaryStorage();
  const [ingredientLibrary, setIngredientLibrary] =
    useIngredientLibraryStorage();

  return (
    <Routes>
      <Route
        path="diary/:date/*"
        element={<DiaryPageViewContainer diary={diary} setDiary={setDiary} />}
      />
      <Route path="chart" element={<WeightChartView diary={diary} />} />
      <Route
        path="/diary"
        element={<Navigate to={`${formatDate(new Date())}`} replace={true} />}
      />
      <Route path="/" element={<Navigate to="diary" />} />
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
      key={pageData.formattedDate}
      meals={pageData.diaryEntry.meals}
      weight={pageData.diaryEntry.weight}
      setWeight={pageData.setWeight}
      setMeals={pageData.setMeals}
      date={pageData.date}
    />
  );
}
