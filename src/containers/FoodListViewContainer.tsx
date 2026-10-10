import FoodListView from "../components/foodListView/FoodListView";
import { useIngredientStorage, useRecipeStorage } from "../useLocalStorage"
import { Route, Routes, useParams } from "react-router-dom";
import RecipeEditView from "../RecipeEditView";
import IngredientEditView from "../components/ingredientEditView/IngredientEditView";

export default function FoodListViewContainer() {
  return <Routes>
    <Route path="/" element={<ListContainer />} />
    <Route path="recipe/:recipeId" element={<RecipeEditContainer />} />
    <Route path="ingredient/:ingredientId" element={<IngredientEditContainer />} />
  </Routes>
}

function ListContainer() {
  const [ingredients] = useIngredientStorage();
  const [recipes] = useRecipeStorage();

  if (!ingredients || !recipes) {
    return <div>NOT FOUND</div>;
  }
  return <FoodListView recipes={recipes} ingredients={ingredients} />;
}

function RecipeEditContainer() {
  const [ingredients] = useIngredientStorage();
  const [recipes] = useRecipeStorage();

  const { recipeId } = useParams();

  const recipe = recipeId ? recipes?.[recipeId] : undefined;

  if (!recipe || !ingredients) {
    return <div>NOT FOUND</div>;
  }
  return <RecipeEditView ingredientLibrary={ingredients} initialMeal={{ recipe, amountG: 0 }} save={() => { }} />;
}

function IngredientEditContainer() {
  const [ingredients] = useIngredientStorage();

  const { ingredientId } = useParams();

  const ingredient = ingredientId ? ingredients?.[ingredientId] : undefined

  if (!ingredient) {
    return <div>NOT FOUND</div>;
  }

  return <IngredientEditView ingredient={ingredient} save={(i) => { }} />
}

