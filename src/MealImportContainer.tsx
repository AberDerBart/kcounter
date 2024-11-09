import AppFrame from "./AppFrame";
import { FormButton } from "./Button";
import { ReactComponent as CloseIcon } from "./close.svg";
import { Diary } from "./types";

import styles from "./MealImport.module.css";
import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { useMemo } from "react";
import { decodeMeal } from "./share";
import { useNavigate } from "react-router-dom";
import useEditDiary from "./useEditDiary";
import { recipeToIngredient } from "./util";

interface Props {
  diary: Diary;
  setDiary: (diary: Diary) => void;
}

export default function MealImportContainer({ diary, setDiary }: Props) {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const meal = useMemo(() => {
    const raw = hash.substring(1);
    const meal = decodeMeal(raw);
    return meal;
  }, [hash]);

  const { addMeal } = useEditDiary(diary, setDiary);

  const ingredient = useMemo(() => recipeToIngredient(meal.recipe), [meal]);

  return (
    <AppFrame
      nav={
        <div className={styles.Header}>
          <Link to="/">
            <Icon component={CloseIcon} />
          </Link>
        </div>
      }
      main={
        <div>
          <div className={styles.Meal}>
            {ingredient.label} ({ingredient.kcalPer100g}kcal/100g)
          </div>
          <FormButton
            onClick={() => {
              addMeal(new Date(), meal);
              navigate("/");
            }}
          >
            Als Mahlzeit hinzufügen
          </FormButton>
        </div>
      }
    ></AppFrame>
  );
}
