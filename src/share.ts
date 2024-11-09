import { z } from "zod";
import { Ingredient, Meal } from "./types";
import { recipeToIngredient } from "./util";
import { v4 } from "uuid";

export function encodeMeal(meal: Meal, reduceToIngredient?: boolean): string {
  if (reduceToIngredient) {
    const ingredient = recipeToIngredient(meal.recipe);
    const mealData = {
      kcalPer100g: ingredient.kcalPer100g,
      label: ingredient.label,
      amountG: meal.amountG,
    };
    return encodeURIComponent(JSON.stringify(mealData));
  }
  const mealWithoutIds = {
    ...meal,
    recipe: {
      ...meal.recipe,
      id: undefined,
      components: meal.recipe.components.map((c) => ({
        ...c,
        ingredient: { ...c.ingredient, id: undefined },
      })),
    },
  };
  const json = JSON.stringify(mealWithoutIds);
  return encodeURIComponent(json);
}

export function decodeMeal(encoded: string): Meal {
  try {
    return decodeFullMeal(encoded);
  } catch (e) {
    return decodeIngredientMeal(encoded);
  }
}

export function decodeFullMeal(encoded: string): Meal {
  const json = decodeURIComponent(encoded);
  return Meal.parse(JSON.parse(json));
}

export function decodeIngredientMeal(encoded: string): Meal {
  const json = decodeURIComponent(encoded);
  const object = JSON.parse(json);
  const parsed = Ingredient.omit({ id: true })
    .merge(z.object({ amountG: z.number() }))
    .parse(object);
  return {
    amountG: parsed.amountG,
    imported: true,
    recipe: {
      id: v4(),
      label: parsed.label,
      components: [
        {
          amountG: parsed.amountG,
          ingredient: {
            id: v4(),
            kcalPer100g: parsed.kcalPer100g,
            label: parsed.label,
          },
        },
      ],
    },
  };
}
