import { ComponentProps } from "react";
import AppFrame from "./AppFrame";
import MealEdit from "./MealEdit";
import { Link } from "react-router-dom";

type Props = ComponentProps<typeof MealEdit>;

export default function MealEditView({ ...passthroughProps }: Props) {
  return (
    <AppFrame
      main={<MealEdit {...passthroughProps} />}
      nav={<Link to="..">back</Link>}
    />
  );
}
