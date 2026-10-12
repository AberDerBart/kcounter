import FoodListView from "../components/foodListView/FoodListView";
import { useIngredientStorage, useRecipeStorage } from "../useLocalStorage"
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import RecipeEditView from "../RecipeEditView";
import IngredientEditView from "../components/ingredientEditView/IngredientEditView";
import { useCallback } from "react";
import { Ingredient, Recipe } from "../types";

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

  return <FoodListView
    recipes={recipes}
    ingredients={ingredients}
    setRecipes={setRecipes}
    setIngredients={setIngredients}
  />;
}

function RecipeEditContainer() {
  const [ingredients, setIngredients] = useIngredientStorage();
  const [recipes, setRecipes] = useRecipeStorage();

  const { recipeId } = useParams();

  const recipe = recipeId ? recipes?.[recipeId] : undefined;
  const navigate = useNavigate();

  const saveAndClose = useCallback((recipe: Recipe) => {
    setRecipes({ ...recipes, [recipe.id]: recipe });
    navigate('..');
  }, [navigate, recipes, setRecipes]);

  const createIngredient = useCallback((ingredient: Ingredient) => {
    setIngredients({ ...ingredients, [ingredient.id]: ingredient });
  }, [ingredients, setIngredients]);

  const deleteRecipe = useCallback(() => {
    if (!recipe) {
      return
    }
    const { [recipe.id]: _drop, ...remaining } = recipes;
    setRecipes(remaining);
    navigate('..');
  }, [navigate, recipe, recipes, setRecipes]);

  if (recipeId === 'new') {
    return <RecipeEditView
      ingredients={ingredients}
      recipes={recipes}
      save={saveAndClose}
      createIngredient={createIngredient}
    />;
  }

  if (!recipe) {
    return <div>NOT FOUND</div>;
  }
  return <RecipeEditView
    ingredients={ingredients}
    recipes={recipes}
    recipe={recipe}
    save={saveAndClose}
    createIngredient={createIngredient}
    delete={deleteRecipe}
  />;
}

function IngredientEditContainer() {
  const [ingredients, setIngredients] = useIngredientStorage();

  const { ingredientId } = useParams();

  const ingredient = ingredientId ? ingredients?.[ingredientId] : undefined
  const navigate = useNavigate();

  const deleteIngredient = useCallback(() => {
    if (!ingredient) {
      return
    }
    const { [ingredient.id]: _drop, ...remaining } = ingredients;
    setIngredients(remaining);
    navigate('..');
  }, [ingredient, ingredients, navigate, setIngredients]);

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

  return <IngredientEditView
    ingredient={ingredient}
    save={saveAndClose}
    delete={deleteIngredient}
  />
}

