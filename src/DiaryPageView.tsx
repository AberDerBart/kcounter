import { addDays, format } from "date-fns";
import { ReactComponent as ScaleIcon } from "./scale-bathroom.svg";
import { ReactComponent as LeftArrowIcon } from "./chevron-left.svg";
import { ReactComponent as RightArrowIcon } from "./chevron-right.svg";
import MealList from "./MealList";
import Icon from "./Icon";
import AppFrame from "./components/appFrame/AppFrame";

import styles from "./DiaryPageView.module.css";
import { DiaryEntry, IngredientLibrary, Meal, RecipeLibrary, Settings } from "./types";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import RecipeEditView from "./RecipeEditView";
import FormInput from "./FormInput";
import { formatDate } from "./util";
import { useCallback, useMemo } from "react";

interface Props {
  settings?: Settings;
  date: Date;
  entry: DiaryEntry;
  setEntry: (entry: DiaryEntry) => void;
  ingredients: IngredientLibrary;
  recipes: RecipeLibrary;
}

export default function DiaryPageView({ entry, setEntry, date, ingredients, settings, recipes }: Props) {
  const setMeals = useCallback((meals: Meal[]) => {
    setEntry({ ...entry, meals });
  }, [entry, setEntry]);
  return (
    <Routes>
      <Route
        path="meal/:mealId"
        element={
          <MealWrapper meals={entry.meals} setMeals={setMeals} ingredients={ingredients} />
        }
      />
      <Route path="/"
        element={
          <DiaryPage
            entry={entry}
            setEntry={setEntry}
            date={date}
            ingredients={ingredients}
            recipes={recipes}
            settings={settings}
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
}: { meals: Meal[], setMeals: (meals: Meal[]) => void, ingredients: IngredientLibrary }) {
  const { mealId } = useParams();

  const index = mealId ? parseInt(mealId) : NaN;

  const navigate = useNavigate();

  if (mealId === "add") {
    return (
      <RecipeEditView
        ingredientLibrary={ingredients}
        save={(meal) => {
          setMeals([...meals, meal]);
          navigate("..");
        }}
      />
    );
  }

  if (Number.isNaN(index) || index < 0 || index >= meals.length) {
    return <div>NotFound</div>;
  }

  return (
    <RecipeEditView
      ingredientLibrary={ingredients}
      initialMeal={meals[index]}
      save={(meal) => {
        let newMeals = [...meals];
        newMeals.splice(index, 1, meal);
        setMeals(newMeals);
        navigate("..");
      }}
    />
  );
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
  date,
}: Props) {
  const updateEntry = useCallback(
    (partial: Partial<DiaryEntry>) => setEntry({ ...entry, ...partial }),
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
