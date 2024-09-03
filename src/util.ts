import { format } from "date-fns";
import { Ingredient, Meal, Recipe } from "./types";

export function formatDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function getMealKcal(meal: Meal) {
  const { totalAmountG, totalKCal } = meal.recipe.components.reduce(
    ({ totalAmountG, totalKCal }, { ingredient, amountG }) => ({
      totalAmountG: totalAmountG + amountG,
      totalKCal: totalKCal + (ingredient.kcalPer100g * amountG) / 100,
    }),
    { totalAmountG: 0, totalKCal: 0 }
  );

  if (!totalAmountG) {
    return 0;
  }

  return (meal.amountG * totalKCal) / totalAmountG;
}

export function recipeToIngredient(recipe: Recipe): Ingredient {
  const { totalAmountG, totalKCal } = recipe.components.reduce(
    ({ totalAmountG, totalKCal }, { ingredient, amountG }) => ({
      totalAmountG: totalAmountG + amountG,
      totalKCal: totalKCal + (ingredient.kcalPer100g * amountG) / 100,
    }),
    { totalAmountG: 0, totalKCal: 0 }
  );

  if (!totalAmountG) {
    return {
      kcalPer100g: 0,
      label: recipe.label,
    };
  }

  return {
    kcalPer100g: Math.round(totalKCal / (totalAmountG / 100)),
    label: recipe.label,
  };
}
