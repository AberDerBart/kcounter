import { z } from "zod";
import { v4 } from "uuid";

interface Ingredient {
  label: string;
  kcalPer100g: number;
  id: string;
}

const Ingredient = z.object({
  label: z.string(),
  kcalPer100g: z.number(),
  id: z.string().uuid().default(v4()),
});

interface Recipe {
  label: string;
  components: {
    ingredient: Ingredient;
    amountG: number;
  }[];
}

const Recipe = z.object({
  label: z.string(),
  components: z.array(
    z.object({
      ingredient: Ingredient,
      amountG: z.number(),
    })
  ),
});

interface Meal {
  recipe: Recipe;
  amountG: number;
}

const Meal = z.object({
  recipe: Recipe,
  amountG: z.number(),
});

interface DiaryEntry {
  weight?: number;
  meals: Meal[];
}

const DiaryEntry = z.object({
  weight: z.number().optional(),
  meals: z.array(Meal),
});

type Diary = Record<string, DiaryEntry>;

const Diary = z.record(DiaryEntry);

export type IngredientLibrary = Record<string, Ingredient>;

const IngredientLibrary = z.record(Ingredient);

export { Ingredient, Recipe, Meal, DiaryEntry, Diary, IngredientLibrary };
