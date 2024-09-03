import { Meal } from "./types";
import { ReactComponent as PlusIcon } from "./plus.svg";
import { ReactComponent as PencilIcon } from "./pencil.svg";
import { ReactComponent as LightningIcon } from "./lightning-bolt.svg";
import { ReactComponent as DeleteIcon } from "./delete.svg";
import styles from "./MealList.module.css";
import { useMemo } from "react";
import Icon from "./Icon";
import { Link } from "react-router-dom";
import Button from "./Button";
import { getMealKcal } from "./util";

interface Props {
  meals: Meal[];
  deleteMeal: (index: number) => void;
}

export default function MealList({ meals, deleteMeal }: Props) {
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
          <MealListItem
            key={index}
            meal={meal}
            editLink={`meal/${index}`}
            remove={() => deleteMeal(index)}
          />
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

function MealListItem({
  meal,
  editLink,
  remove,
}: {
  meal: Meal;
  editLink: string;
  remove: () => void;
}) {
  const kcal = useMemo(() => Math.round(getMealKcal(meal)), [meal]);
  return (
    <li className={styles.ListItem}>
      <Link to={editLink}>
        <Icon component={PencilIcon} small />
      </Link>
      {meal.recipe.label}: {meal.amountG} g, {kcal} kcal
      <Button type="button" onClick={remove}>
        <Icon component={DeleteIcon} small />
      </Button>
    </li>
  );
}
