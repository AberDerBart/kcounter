import { Ingredient } from "../../types";
import AppFrame from "../appFrame/AppFrame";
import AppFrameHeader, { NavBack } from "../appFrame/AppFrameHeader";
import Dropdown from "../dropdown/Dropdown";
import DropdownAction from "../dropdown/DropdownAction";

import { ReactComponent as TrashIcon } from 'src/delete.svg'

import IngredientEditForm from "../ingredientEditForm/IngredientEditForm";

interface Props {
  delete?: () => void;
  ingredient?: Ingredient;
  save: (ingredient: Ingredient) => void;
}

export default function IngredientEditView(props: Props) {
  return (
    <AppFrame nav={
      <AppFrameHeader>
        <NavBack />
        {!!props.delete &&
          <Dropdown align="right">
            <DropdownAction onClick={props.delete} icon={TrashIcon} label="Zutat löschen" />
          </Dropdown>
        }
      </AppFrameHeader>
    }>
      <IngredientEditForm {...props} />
    </AppFrame>
  );
}