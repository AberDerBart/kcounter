import { useMemo, useState } from "react";
import AppFrame from "../../AppFrame";
import Button from "../../Button";
import Icon from "../../Icon";
import { ReactComponent as FilterIcon } from "../../filter.svg";
import { ReactComponent as FilterActiveIcon } from "../../filter-active.svg";
import { ReactComponent as EditIcon } from "../../pencil.svg";

import styles from "./FoodListView.module.css";
import { Ingredient, Recipe } from "../../types";
import { Link } from "react-router-dom";

interface Props {
  recipes: Record<string, Recipe>;
  ingredients: Record<string, Ingredient>;
}

type Filter = {
  showRecipes: boolean;
  showIngredients: boolean;
};

interface ListItem {
  id: string;
  label: string;
  type: 'recipe' | 'ingredient';
}

export default function FoodListView({ recipes, ingredients }: Props) {
  const [filter, setFilter] = useState<Filter>({ showIngredients: true, showRecipes: true });

  const sortedItems = useMemo(() => {
    const items: ListItem[] = [
      ...Object.values(recipes).map((r) => ({ id: r.id, label: r.label, type: 'recipe' as const })),
      ...Object.values(ingredients).map((i) => ({ id: i.id, label: i.label, type: 'ingredient' as const })),
    ];

    return items.sort((l, r) => l.label.localeCompare(r.label));
  }, [ingredients, recipes]);

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

  return <AppFrame nav={<Header filter={filter} setFilter={setFilter} />}>
    <ul className={styles.List}>
      {filteredItems.map((item) => <ListElement item={item} key={`${item.type}-${item.id}`} />)}
    </ul>
  </AppFrame>
}

function ListElement({ item }: { item: ListItem }) {
  return <li className={styles.ListElement}>
    <div>{item.label}</div>
    <Link to={`/food/${item.type}/${item.id}`}>
      <Icon component={EditIcon} />
    </Link>
  </li>
}

function Header({ filter, setFilter }: { filter: Filter; setFilter: (f: Filter) => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return <div className={styles.Header}>
    <div className={styles.FilterDropdownWrapper}>
      <Button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}><Icon component={isFilterActive(filter) ? FilterActiveIcon : FilterIcon} /></Button>
      {dropdownOpen && (
        <div className={styles.FilterDropdown}>
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
        </div>
      )}
    </div>

  </div >
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
