import { Ingredient } from "../../types";
import AppFrame from "../appFrame/AppFrame";
import AppFrameHeader, { NavBack } from "../appFrame/AppFrameHeader";

import IngredientEditForm from "../ingredientEditForm/IngredientEditForm";

interface Props {
  ingredient?: Ingredient;
  save: (ingredient: Ingredient) => void;
}

export default function IngredientEditView(props: Props) {
  return (
    <AppFrame nav={<AppFrameHeader><NavBack /></AppFrameHeader>}>
      <IngredientEditForm {...props} />
    </AppFrame>
  );
}