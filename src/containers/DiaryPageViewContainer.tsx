import { useCallback, useMemo } from "react";
import {
  DiaryEntryV2,
  Ingredient,
  Recipe,
} from "../types";
import DiaryPageView from "../DiaryPageView";
import { useParams } from "react-router-dom";
import { formatDate } from "../util";
import { useDiaryV2Storage, useIngredientStorage, useRecipeStorage, useSettingsStorage } from "../useLocalStorage";

export default function DiaryPageViewContainer() {
  const [diary, setDiary] = useDiaryV2Storage();
  const [recipes, setRecipes] = useRecipeStorage();
  const [ingredients, setIngredients] = useIngredientStorage();
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

    console.log(diary);
    const diaryEntry: DiaryEntryV2 = (diary[formattedDate] as DiaryEntryV2 | undefined) ?? { meals: [], period: false, poop: false, weight: undefined };

    return { date, diaryEntry, formattedDate, };
  }, [dateParams, diary]);

  const setEntry = useCallback((entry: DiaryEntryV2) => {
    if (!dateParams) {
      return;
    }
    setDiary({
      ...diary, [dateParams]: entry
    });
  }, [dateParams, diary, setDiary]);

  const addRecipe = useCallback((recipe: Recipe) => {
    setRecipes({ ...recipes, [recipe.id]: recipe })
  }, [recipes, setRecipes]);

  const addIngredient = useCallback((ingredient: Ingredient) => {
    setIngredients({ ...ingredients, [ingredient.id]: ingredient });
  }, [ingredients, setIngredients])

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
      addIngredient={addIngredient}
      addRecipe={addRecipe}
    />
  );
}
