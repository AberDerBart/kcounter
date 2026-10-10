import FoodListView from "../components/foodListView/FoodListView";
import { useIngredientStorage, useRecipeStorage } from "../useLocalStorage"
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import RecipeEditView from "../RecipeEditView";
import IngredientEditView from "../components/ingredientEditView/IngredientEditView";
import { useCallback } from "react";
import { Ingredient, Meal } from "../types";
import { v4 } from "uuid";

export default function FoodListViewContainer() {
  return <Routes>
    <Route path="/" element={<ListContainer />} />
    <Route path="recipe/:recipeId" element={<RecipeEditContainer />} />
    <Route path="ingredient/:ingredientId" element={<IngredientEditContainer />} />
  </Routes>
}

function ListContainer() {
  const [ingredients, setIngredients] = useIngredientStorage();
  const [recipes, setRecipes] = useRecipeStorage();

  if (!ingredients || !recipes) {
    return <div>NOT FOUND</div>;
  }
  return <FoodListView
    recipes={recipes}
    ingredients={ingredients}
    setRecipes={setRecipes}
    setIngredients={setIngredients}
  />;
}

function RecipeEditContainer() {
  const [ingredients] = useIngredientStorage();
  const [recipes, setRecipes] = useRecipeStorage();

  const { recipeId } = useParams();

  const recipe = recipeId ? recipes?.[recipeId] : undefined;
  const navigate = useNavigate();

  const saveAndClose = useCallback(({ recipe }: Meal) => {
    setRecipes({ ...recipes, [recipe.id]: recipe });
    navigate('..');
  }, [navigate, recipes, setRecipes]);


  if (!ingredients) {
    return <div>NOT FOUND</div>;
  }

  if (recipeId === 'new') {
    return <RecipeEditView ingredientLibrary={ingredients} save={saveAndClose} />;
  }

  if (!recipe) {
    return <div>NOT FOUND</div>;
  }
  return <RecipeEditView ingredientLibrary={ingredients} initialMeal={{ recipe, amountG: 0 }} save={saveAndClose} />;
}

function IngredientEditContainer() {
  const [ingredients, setIngredients] = useIngredientStorage();

  const { ingredientId } = useParams();

  const ingredient = ingredientId ? ingredients?.[ingredientId] : undefined
  const navigate = useNavigate();

  const saveAndClose = useCallback((ingredient: Ingredient) => {
    setIngredients({ ...ingredients, [ingredient.id]: ingredient });
    navigate('..');
  }, [ingredients, navigate, setIngredients]);

  if (ingredientId === 'new') {
    return <IngredientEditView save={saveAndClose} />;
  }

  if (!ingredient) {
    return <div>NOT FOUND</div>;
  }

  return <IngredientEditView ingredient={ingredient} save={saveAndClose} />
}

