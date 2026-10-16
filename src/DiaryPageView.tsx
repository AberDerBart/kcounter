import { addDays, format } from "date-fns";
import { ReactComponent as ScaleIcon } from "./scale-bathroom.svg";
import { ReactComponent as LeftArrowIcon } from "./chevron-left.svg";
import { ReactComponent as RightArrowIcon } from "./chevron-right.svg";
import MealList from "./MealList";
import Icon from "./Icon";
import AppFrame from "./components/appFrame/AppFrame";

import styles from "./DiaryPageView.module.css";
import { DiaryEntryV2, Ingredient, IngredientLibrary, MealV2, Recipe, RecipeLibrary, Settings } from "./types";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import FormInput from "./FormInput";
import { formatDate, recipeToIngredient } from "./util";
import { useCallback, useMemo } from "react";
import MealEditView from "./components/mealEditView/MealEditView";
import RecipeEditView from "./RecipeEditView";
import { v4 } from "uuid";

interface Props {
  settings?: Settings;
  date: Date;
  entry: DiaryEntryV2;
  setEntry: (entry: DiaryEntryV2) => void;
  ingredients: IngredientLibrary;
  recipes: RecipeLibrary;
  addRecipe: (r: Recipe) => void;
  addIngredient: (i: Ingredient) => void;
}

export default function DiaryPageView(
  props
    : Props) {
  const {
    entry,
    setEntry,
    ingredients,
    recipes,
    addRecipe,
    addIngredient,
  } = props;
  const setMeals = useCallback((meals: MealV2[]) => {
    setEntry({ ...entry, meals });
  }, [entry, setEntry]);

  const saveAndAddRecipe = useCallback((recipe: Recipe) => {
    addRecipe(recipe);
    const food = recipeToIngredient(recipe);

    setMeals([...entry.meals, { food: { ...food, type: 'recipe' }, portions: [] }])
  }, [addRecipe, entry.meals, setMeals]);

  return (
    <Routes>
      <Route
        path="meal/:mealId"
        element={
          <MealWrapper meals={entry.meals} setMeals={setMeals} ingredients={ingredients} recipes={recipes} />
        }
      />
      <Route
        path="addRecipe"
        element={
          <AddRecipeWrapper
            ingredients={ingredients}
            recipes={recipes}
            saveAndAddRecipe={saveAndAddRecipe}
            createIngredient={addIngredient}
          />
        }
      />
      <Route path=""
        element={
          <DiaryPage
            {...props}
          />
        }
      />
    </Routes>
  );
}

function MealWrapper({
  meals,
  setMeals,
  ingredients,
  recipes
}: { meals: MealV2[], setMeals: (meals: MealV2[]) => void, recipes: RecipeLibrary, ingredients: IngredientLibrary }) {
  const { mealId } = useParams();

  const index = mealId ? parseInt(mealId) : NaN;

  const addOrModifyMealAtIndex = useCallback((m: MealV2) => {
    if (mealId === "add") {
      console.log("adding meal");
      setMeals([...meals, m]);
    }
    setMeals(meals.toSpliced(index, 1, m));
  }, [index, mealId, meals, setMeals]);

  const addMeal = useCallback((m: MealV2) =>
    setMeals([...meals, m]), [meals, setMeals]);

  if (mealId === "add") {
    return (
      <MealEditView
        ingredients={ingredients}
        recipes={recipes}
        save={addMeal}
      />
    );
  }

  if (Number.isNaN(index) || index < 0 || index >= meals.length) {
    return <div>NotFound</div>;
  }

  return (
    <MealEditView
      ingredients={ingredients}
      recipes={recipes}
      meal={meals[index]}
      save={addOrModifyMealAtIndex}
    />
  );
}

function AddRecipeWrapper({
  recipes,
  ingredients,
  saveAndAddRecipe,
  createIngredient,
}: {
  recipes: RecipeLibrary;
  ingredients: IngredientLibrary
  saveAndAddRecipe: (r: Recipe) => void;
  createIngredient: (i: Ingredient) => void;
}) {
  const { state } = useLocation()
  const navigate = useNavigate();

  const save = useCallback((recipe: Recipe) => {
    saveAndAddRecipe(recipe);
    navigate("..");
  }, [navigate, saveAndAddRecipe])

  return <RecipeEditView
    ingredients={ingredients}
    recipes={recipes}
    recipe={{ components: [], id: v4(), label: state?.label ?? '' }}
    save={save}
    createIngredient={createIngredient}
  />
}

function DiaryPage(props: Props) {
  const { nextLink, prevLink } = useMemo(() => {
    return {
      nextLink: `/diary/${formatDate(addDays(props.date, 1))}`,
      prevLink: `/diary/${formatDate(addDays(props.date, -1))}`,
    };
  }, [props.date]);

  return (
    <AppFrame
      nav={
        <div className={styles.Header}>
          <Link to={prevLink}>
            <LeftArrowIcon className={styles.Icon} />
          </Link>
          <h1>{format(props.date, "d.L.yy")}</h1>
          <Link to={nextLink}>
            <RightArrowIcon className={styles.Icon} />
          </Link>
        </div>
      }
    >
      <DiaryPageMain {...props} />
    </AppFrame>
  );
}

function DiaryPageMain({
  entry,
  settings,
  setEntry,
}: Props) {
  const updateEntry = useCallback(
    (partial: Partial<DiaryEntryV2>) => setEntry({ ...entry, ...partial }),
    [entry, setEntry],
  );
  const deleteMeal = useCallback(
    (index: number) => {
      let newMeals = [...entry.meals];
      newMeals.splice(index, 1);
      console.log(newMeals);
      updateEntry({ meals: newMeals });
    },
    [entry.meals, updateEntry]
  );

  return (
    <div>
      <div className={styles.WeightSection}>
        <Icon component={ScaleIcon} />
        <FormInput
          value={entry.weight}
          label="Gewicht (kg)"
          onChange={(e) => updateEntry({ weight: parseFloat(e.target.value) })}
          type="number"
          step={0.1}
          min={0}
        />
        <Icon />
      </div>
      <div className={styles.Options}>
        <div className={styles.Option}>
          <label>
            <input
              type="checkbox"
              className={styles.Checkbox}
              checked={!!entry.poop}
              onChange={(e) => updateEntry({ poop: e.target.checked })}
            />
            <div>💩</div>
          </label>
        </div>
        <div className={styles.Option}>
          <label>
            <input
              type="checkbox"
              className={styles.Checkbox}
              checked={!!entry.period}
              onChange={(e) => updateEntry({ period: e.target.checked })}
            />
            <div>🩸</div>
          </label>
        </div>
      </div>
      <MealList meals={entry.meals} deleteMeal={deleteMeal} settings={settings} />
    </div>
  );
}
