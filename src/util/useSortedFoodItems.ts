import { useMemo } from "react";
import { IngredientLibrary, RecipeLibrary } from "../types";
import { recipeToIngredient } from "../util";

export interface FoodItem {
  id: string;
  label: string;
  type: "recipe" | "ingredient";
  kcalPer100g: number;
}

export default function useSortedFoodItems(
  recipes: RecipeLibrary,
  ingredients: IngredientLibrary,
) {
  return useMemo(() => {
    const items: FoodItem[] = [
      ...Object.values(recipes).map((r) => ({
        type: "recipe" as const,
        ...recipeToIngredient(r),
      })),
      ...Object.values(ingredients).map((i) => ({
        type: "ingredient" as const,
        ...i,
      })),
    ];

    return items.sort((l, r) => l.label.localeCompare(r.label));
  }, [ingredients, recipes]);
}
