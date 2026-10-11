import { useCallback, useMemo, useState } from "react";
import AppFrame from "../appFrame/AppFrame";
import Button from "../../Button";
import Icon from "../../Icon";
import { ReactComponent as FilterIcon } from "../../filter.svg";
import { ReactComponent as FilterActiveIcon } from "../../filter-active.svg";
import { ReactComponent as EditIcon } from "../../pencil.svg";
import { ReactComponent as MultiSelectIcon } from "../../multiselect.svg";
import { ReactComponent as CrossIcon } from "../../close.svg";
import { ReactComponent as DeleteIcon } from "../../delete.svg";
import { ReactComponent as PlusIcon } from "../../plus.svg";


import styles from "./FoodListView.module.css";
import { Ingredient, Recipe } from "../../types";
import { Link } from "react-router-dom";
import useMultiSelect, { MultiSelect } from "../../util/useMultiSelect";
import Checkbox from "../checkbox/Checkbox";
import Dropdown from "../dropdown/Dropdown";
import useSortedFoodItems, { FoodItem } from "../../util/useSortedFoodItems";
import DropdownAction from "../dropdown/DropdownAction";

interface Props {
  recipes: Record<string, Recipe>;
  ingredients: Record<string, Ingredient>;
  setRecipes: (recipes: Record<string, Recipe>) => void;
  setIngredients: (recipes: Record<string, Ingredient>) => void;
}

type Filter = {
  showRecipes: boolean;
  showIngredients: boolean;
};


export default function FoodListView({ recipes, ingredients, setRecipes, setIngredients }: Props) {
  const [filter, setFilter] = useState<Filter>({ showIngredients: true, showRecipes: true });

  const sortedItems = useSortedFoodItems(recipes, ingredients);

  const filteredItems = useMemo(() => {
    if (!isFilterActive(filter)) {
      return sortedItems;
    }

    return sortedItems.filter((i) => {
      if (i.type === 'ingredient' && !filter.showIngredients) {
        return false;
      }
      if (i.type === 'recipe' && !filter.showRecipes) {
        return false;
      }
      return true;
    })
  }, [filter, sortedItems]);

  const filteredIds = useMemo(
    () => filteredItems.map((i) => i.id),
    [filteredItems],
  );

  const multiselect = useMultiSelect(filteredIds);

  const deleteItems = useCallback((ids: Set<string>) => {
    const filteredRecipes = Object.entries(recipes).filter(([rId]) => !ids.has(rId));
    setRecipes(Object.fromEntries(filteredRecipes));

    const filteredIngredients = Object.entries(ingredients).filter(([iId]) => !ids.has(iId));
    setIngredients(Object.fromEntries(filteredIngredients));
  }, [ingredients, recipes, setIngredients, setRecipes]);

  return <AppFrame nav={<Header filter={filter} setFilter={setFilter} multiSelect={multiselect} deleteItems={deleteItems} />}>
    <div className={styles.AddLinks}>
      <Link to="recipe/new" className={styles.AddLink}>
        Neues Rezept<Icon component={PlusIcon} />
      </Link>
      <Link to="ingredient/new" className={styles.AddLink}>
        Neue Zutat<Icon component={PlusIcon} />
      </Link>
    </div>
    <ul className={styles.List}>
      {filteredItems.map((item) => {
        return <ListElement item={item} key={`${item.type}-${item.id}`} multiSelect={multiselect} />
      })}
    </ul>
  </AppFrame>
}

function ListElement({ item, multiSelect }: { item: FoodItem, multiSelect: MultiSelect }) {
  return <li className={styles.ListElement}>
    <div className={styles.Label}>{item.label}</div>
    {multiSelect.enabled ? (
      <Checkbox
        checked={multiSelect.selectedIds.has(item.id)}
        onChange={(e) => multiSelect.setSelected(item.id, e.target.checked)}
      />
    ) : (
      <Link to={`/food/${item.type}/${item.id}`}>
        <Icon component={EditIcon} />
      </Link>
    )}
  </li>
}

function Header({
  filter,
  setFilter,
  multiSelect,
  deleteItems,
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
  multiSelect: MultiSelect;
  deleteItems: (ids: Set<string>) => void;
}) {
  return <div className={styles.Header}>
    <FilterButton filter={filter} setFilter={setFilter} />
    <MultiSelectMenu multiSelect={multiSelect} deleteItems={deleteItems} />
  </div >
}

function FilterButton({ filter, setFilter }: { filter: Filter; setFilter: (f: Filter) => void }) {
  return (
    <Dropdown
      align="left"
      renderButton={({ isOpen, setOpen }) => (
        <Button type="button" onClick={() => setOpen(!isOpen)}>
          <Icon component={isFilterActive(filter) ? FilterActiveIcon : FilterIcon} />
        </Button>
      )}
    >
      <FilterOption
        label="Rezepte"
        enabled={filter.showRecipes}
        setEnabled={(enabled) => setFilter({ ...filter, showRecipes: enabled })}
      />
      <FilterOption
        label="Zutaten"
        enabled={filter.showIngredients}
        setEnabled={(enabled) => setFilter({ ...filter, showIngredients: enabled })}
      />
    </Dropdown>
  );
}

function FilterOption({ label, enabled, setEnabled }: { label: string; enabled: boolean; setEnabled: (e: boolean) => void }) {
  return (
    <label className={styles.FilterOption}>
      <input
        type="checkbox"
        className={styles.Checkbox}
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
      />
      {label}
    </label>
  )
}

function isFilterActive(filter: Filter) {
  return !filter.showRecipes || !filter.showIngredients;
}

function MultiSelectMenu({ multiSelect, deleteItems }: { multiSelect: MultiSelect, deleteItems: (ids: Set<string>) => void }) {
  return (
    <div className={styles.MultiSelectMenu}>
      {multiSelect.enabled ? (
        <>
          <Button type="button" onClick={() => multiSelect.setEnabled(false)}>
            <Icon component={CrossIcon} />
          </Button>
          <Dropdown align="right">
            <DropdownAction
              icon={DeleteIcon}
              label="Löschen"
              onClick={() => {
                deleteItems(multiSelect.selectedIds);
                multiSelect.setEnabled(false);
              }}
              disabled={multiSelect.selectedIds.size === 0}
            />
          </Dropdown>
        </>
      ) : (
        <Button type="button" onClick={() => multiSelect.setEnabled(true)}>
          <Icon component={MultiSelectIcon} />
        </Button>
      )
      }
    </div >
  );
}
