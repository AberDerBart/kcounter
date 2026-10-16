import FormInput from "../../FormInput";
import { IngredientLibrary, MealV2, RecipeLibrary } from "../../types";
import useSortedFoodItems, { FoodItem } from "../../util/useSortedFoodItems";
import AppFrame from "../appFrame/AppFrame";
import AppFrameHeader, { ButtonSpacer, NavBack } from "../appFrame/AppFrameHeader";
import { useCallback, useEffect, useMemo, useState } from "react";

import styles from "./MealEditView.module.css";
import Button, { FormButton } from "../../Button";

import { useNavigate } from "react-router-dom";

interface Props {
  meal?: MealV2;
  save: (meal: MealV2) => void;
  recipes: RecipeLibrary;
  ingredients: IngredientLibrary;
}

export default function MealEditView({ meal: initialMeal, save, recipes, ingredients }: Props) {
  const [foodItem, setFoodItem] = useState<FoodItem | undefined>(initialMeal?.food);

  const [newAmountG, setNewAmountG] = useState('');
  const navigate = useNavigate();

  const submitAndClose = useCallback(() => {
    const amountG = newAmountG === '' ? 0 : Number.parseInt(newAmountG);
    if (isNaN(amountG)) {
      return;
    }
    if (initialMeal) {
      save({ ...initialMeal, portions: [...initialMeal.portions, { type: 'weight', amountG }] })
    } else {
      if (!foodItem) {
        return;
      }
      save({ food: foodItem, portions: [{ type: 'weight', amountG }] })
    }
    navigate('..');
  }, [foodItem, initialMeal, navigate, newAmountG, save]);

  if (!foodItem) {
    return <MealSearchView recipes={recipes} ingredients={ingredients} select={setFoodItem} />
  }

  return <AppFrame
    nav={(
      <AppFrameHeader>
        <NavBack />
        <h2>{foodItem.label}</h2>
        <ButtonSpacer />
      </AppFrameHeader>
    )}
  >
    <form>
      <ul className={styles.List}>
        {initialMeal?.portions.map((p) => (
          <FormInput
            label="Portion (g)"
            readOnly
            disabled
            value={p.amountG}
            className={styles.FormElement}
          />
        ))}
      </ul>
      <FormInput
        className={styles.FormElement}
        label="Portion (g)"
        value={newAmountG}
        autoFocus
        onChange={(e) => setNewAmountG(e.target.value)}
      />
      <FormButton type="submit" onClick={submitAndClose} className={styles.SubmitButton}>
        Speichern
      </FormButton>
    </form>
  </AppFrame>
}

function MealSearchView({ recipes, ingredients, select }: { recipes: RecipeLibrary; ingredients: IngredientLibrary, select: (item: FoodItem) => void }) {
  const sortedItems = useSortedFoodItems(recipes, ingredients);
  const [searchString, setSearchString] = useState('');

  const filteredItems = useMemo(
    () => {
      const normalizedSearchString = searchString.trim().toLowerCase()
      return sortedItems.filter((i) => i.label.toLowerCase().includes(normalizedSearchString))
    },
    [searchString, sortedItems],
  );

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter" && filteredItems.length > 0) {
        e.preventDefault();
        select(filteredItems[0])
      }
    }

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  })

  return <AppFrame
    nav={(
      <AppFrameHeader>
        <NavBack />
        <FormInput
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          autoFocus
          type="search"
          className={styles.SearchInput}
          placeholder="Suchen…"
        />
        <ButtonSpacer />
      </AppFrameHeader>)
    }
  >
    <ul className={styles.List}>
      {filteredItems.map((item) => (
        <SearchListItem item={item} onSelect={() => select(item)} />
      ))}
    </ul>
  </AppFrame>
}

function SearchListItem({ item, onSelect }: { item: FoodItem, onSelect: () => void }) {
  return <li>
    <Button type="button" onClick={onSelect} className={styles.SelectFoodButton}>
      {item.label}
    </Button>
  </li>
}
