import { useEffect } from "react";
import {
  useDiaryStorage,
  useIngredientStorage,
  useRecipeStorage,
} from "./useLocalStorage";
import { migrateData } from "./migrate";

export default function useMigrate() {
  const [diary] = useDiaryStorage();
  const [recipes, setRecipes] = useRecipeStorage();
  const [ingredients, setIngredients] = useIngredientStorage();

  useEffect(() => {
    if (!diary) {
      return;
    }

    const hasRecipes = !!recipes && Object.values(recipes).length > 0;
    const hasIngredients =
      !!ingredients && Object.values(ingredients).length > 0;

    if (hasRecipes && hasIngredients) {
      return;
    }

    const { ingredients: migratedIngredients, recipes: migratedRecipes } =
      migrateData(diary);

    if (!hasRecipes) {
      setRecipes(migratedRecipes);
    }

    if (!hasIngredients) {
      setIngredients(migratedIngredients);
    }
  });
}
