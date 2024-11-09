import { useMemo } from "react";
import { Meal } from "./types";

import { ReactComponent as ShareIcon } from "./share.svg";
import Button from "./Button";
import Icon from "./Icon";
import { encodeMeal } from "./share";
import { useLocation } from "react-router-dom";

interface Props {
  meal: Meal;
}

export default function MealShareButton({ meal }: Props) {
  const mealLink = useMemo(() => {
    const { protocol, host } = window.location;
    return `${protocol}//${host}/import/meal#${encodeMeal(meal, true)}`;
  }, [meal]);
  return (
    <Button
      onClick={async () => {
        if (navigator.share) {
          await navigator.share({ url: mealLink });
        } else {
          await navigator.clipboard.writeText(mealLink);
          alert("A link has been copied to your clipboard");
        }
      }}
    >
      <Icon component={ShareIcon} />
    </Button>
  );
}
