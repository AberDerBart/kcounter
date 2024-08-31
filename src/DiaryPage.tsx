import { addDays, format } from "date-fns";
import { ReactComponent as ScaleIcon } from "./scale-bathroom.svg";
import { ReactComponent as LeftArrowIcon } from "./chevron-left.svg";
import { ReactComponent as RightArrowIcon } from "./chevron-right.svg";
import MealList from "./MealList";
import Icon from "./Icon";
import AppFrame from "./AppFrame";

import styles from "./DiaryPage.module.css";
import { Meal } from "./types";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import MealEditView from "./MealEditView";
import FormInput from "./FormInput";
import { formatDate } from "./util";
import { useMemo } from "react";

interface Props {
  date: Date;
  weight?: number;
  meals: Meal[];
  setMeals: (newMeals: Meal[]) => void;
  setWeight: (weight: number) => void;
}

export default function DiaryView(props: Props) {
  return (
    <Routes>
      <Route path="meal/:mealId" element={<MealWrapper {...props} />} />
      <Route path="/" element={<DiaryPage {...props} />} />
    </Routes>
  );
}

function MealWrapper({ meals, setMeals }: Props) {
  const { mealId } = useParams();

  const index = mealId ? parseInt(mealId) : NaN;

  const navigate = useNavigate();

  if (mealId === "new") {
    return (
      <MealEditView
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
    <MealEditView
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
      main={<DiaryPageMain {...props} />}
    />
  );
}

function DiaryPageMain({ weight, meals, setWeight }: Props) {
  return (
    <div>
      <div className={styles.WeightSection}>
        <Icon component={ScaleIcon} />
        <FormInput
          value={weight}
          label="Gewicht (kg)"
          onChange={(e) => setWeight(parseFloat(e.target.value))}
          type="number"
          step={0.1}
          min={0}
        />
        <Icon />
      </div>
      <MealList meals={meals} />
    </div>
  );
}
