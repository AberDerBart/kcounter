import { Diary, DiaryV2, Ingredient, MealV2, Recipe } from "./types";
import { recipeToIngredient } from "./util";

export function migrateData(diary: Diary) {
  let recipes: Record<string, Recipe> = {};
  let ingredients: Record<string, Ingredient> = {};

  let diaryV2: DiaryV2 = {};

  for (const [date, entry] of Object.entries(diary)) {
    const { meals, ...rest } = entry;

    let mealsV2: MealV2[] = [];
    for (const meal of meals) {
      mealsV2.push({
        food: {
          type: "recipe",
          ...recipeToIngredient(meal.recipe),
        },
        portions: [
          {
            type: "weight",
            amountG: meal.amountG,
          },
        ],
      });
      recipes[meal.recipe.id] = meal.recipe;

      for (const { ingredient } of meal.recipe.components) {
        ingredients[ingredient.id] = ingredient;
      }
    }

    diaryV2[date] = {
      ...rest,
      period: rest.period ?? false,
      poop: rest.poop ?? false,
      meals: mealsV2,
    };
  }

  for (const id of Object.keys(recipes)) {
    delete ingredients[id];
  }

  return { diary: diaryV2, ingredients, recipes };
}
