import { useEffect } from "react";
import {
  useDiaryStorage,
  useDiaryV2Storage,
  useIngredientStorage,
  useRecipeStorage,
} from "./useLocalStorage";
import { migrateData } from "./migrate";

export default function useMigrate() {
  const [diary] = useDiaryStorage();
  const [diaryV2, setDiaryV2] = useDiaryV2Storage();
  const [recipes, setRecipes] = useRecipeStorage();
  const [ingredients, setIngredients] = useIngredientStorage();

  useEffect(() => {
    if (!diary) {
      return;
    }

    const hasRecipes = !!recipes && Object.values(recipes).length > 0;
    const hasIngredients =
      !!ingredients && Object.values(ingredients).length > 0;
    const hasDiaryV2 = !!diaryV2 && Object.values(diaryV2).length > 0;

    if (hasRecipes && hasIngredients && hasDiaryV2) {
      return;
    }

    const {
      ingredients: migratedIngredients,
      recipes: migratedRecipes,
      diary: migratedDiary,
    } = migrateData(diary);

    if (!hasRecipes) {
      setRecipes(migratedRecipes);
    }

    if (!hasIngredients) {
      setIngredients(migratedIngredients);
    }

    if (!hasDiaryV2) {
      setDiaryV2(migratedDiary);
    }
  });
}
