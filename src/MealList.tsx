import { Meal } from "./types";
import { ReactComponent as PlusIcon } from "./plus.svg";
import { ReactComponent as PencilIcon } from "./pencil.svg";
import { ReactComponent as LightningIcon } from "./lightning-bolt.svg";
import styles from "./MealList.module.css";
import { useMemo } from "react";
import Icon from "./Icon";
import { Link } from "react-router-dom";

interface Props {
  meals: Meal[];
}

export default function MealList({ meals }: Props) {
  const totalKcal = useMemo(
    () => meals.reduce((total, meal) => total + getMealKcal(meal), 0),
    [meals]
  );
  return (
    <div>
      <div className={styles.Summary}>
        <Icon component={LightningIcon} />
        {Math.round(totalKcal)} kcal
        <Icon />
      </div>
      <ul className={styles.List}>
        {meals.map((meal, index) => (
          <MealListItem key={index} meal={meal} editLink={`meal/${index}`} />
        ))}
        <li className={styles.ListItem}>
          <Link to="meal/new" className={styles.Link}>
            Mahlzeit hinzufügen
            <Icon component={PlusIcon} small />
          </Link>
        </li>
      </ul>
    </div>
  );
}

function MealListItem({ meal, editLink }: { meal: Meal; editLink: string }) {
  const kcal = useMemo(() => Math.round(getMealKcal(meal)), [meal]);
  return (
    <li className={styles.ListItem}>
      {meal.recipe.label}: {meal.amountG} g, {kcal} kcal
      <Link to={editLink}>
        <Icon component={PencilIcon} small />
      </Link>
    </li>
  );
}

function getMealKcal(meal: Meal) {
  const { totalAmountG, totalKCal } = meal.recipe.components.reduce(
    ({ totalAmountG, totalKCal }, { ingredient, amountG }) => ({
      totalAmountG: totalAmountG + amountG,
      totalKCal: totalKCal + (ingredient.kcalPer100g * amountG) / 100,
    }),
    { totalAmountG: 0, totalKCal: 0 }
  );

  return (meal.amountG * totalKCal) / totalAmountG;
}
