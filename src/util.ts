import { format } from "date-fns";
import { Meal } from "./types";

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
