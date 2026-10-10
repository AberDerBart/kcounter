import { useMemo } from "react";
import FoodListView from "../components/foodListView/FoodListView";
import { migrateData } from "../migrate";
import { useDiaryStorage } from "../useLocalStorage"
import { Route, Routes, useParams } from "react-router-dom";
import RecipeEditView from "../RecipeEditView";

export default function FoodListViewContainer() {
  const [diary] = useDiaryStorage();
  const { recipes, ingredients } = useMemo(() => {
    if (!diary) {
      return {
        recipes: {},
        ingredients: {},
      }
    }
    return migrateData(diary);
  }, [diary]);
  return <Routes>
    <Route path="/" element={<FoodListView recipes={recipes} ingredients={ingredients} />} />
    <Route path="recipe/:recipeId" element={<RecipeEditContainer />} />
  </Routes>
}

function RecipeEditContainer() {
  const ingredients = useIngredients();
  const recipes = useRecipes();

  const { recipeId } = useParams();

  const recipe = recipeId ? recipes?.[recipeId] : undefined;

  if (!recipe || !ingredients) {
    console.log(recipe, ingredients);
    return <div>NOT FOUND</div>;
  }
  return <RecipeEditView ingredientLibrary={ingredients} initialMeal={{ recipe, amountG: 0 }} save={() => { }} />;
}

function useIngredients() {
  const [diary] = useDiaryStorage();
  return useMemo(() => {
    if (!diary) {
      return undefined;
    }
    return migrateData(diary).ingredients;
  }, [diary]);
}

function useRecipes() {
  const [diary] = useDiaryStorage();
  return useMemo(() => {
    if (!diary) {
      return undefined;
    }
    return migrateData(diary).recipes;
  }, [diary]);
}