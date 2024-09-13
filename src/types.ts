import { z } from "zod";
import { v4 } from "uuid";

interface Ingredient {
  label: string;
  kcalPer100g: number;
  id: string;
}

const Ingredient = z.object({
  label: z.string(),
  kcalPer100g: z.number().or(z.string().transform((s) => parseFloat(s))),
  id: z.string().uuid().default(v4()),
});

interface Recipe {
  id: string;
  label: string;
  components: {
    ingredient: Ingredient;
    amountG: number;
  }[];
}

const Recipe = z.object({
  id: z.string().uuid().default(v4()),
  label: z.string(),
  components: z.array(
    z.object({
      ingredient: Ingredient,
      amountG: z.number().or(z.string().transform((s) => parseFloat(s))),
    })
  ),
});

interface Meal {
  recipe: Recipe;
  amountG: number;
}

const Meal = z.object({
  recipe: Recipe,
  amountG: z.number().or(z.string().transform((s) => parseFloat(s))),
});

interface DiaryEntry {
  weight?: number;
  meals: Meal[];
}

const DiaryEntry = z.object({
  weight: z
    .number()
    .or(z.string().transform((s) => parseFloat(s)))
    .optional(),
  meals: z.array(Meal),
});

type Diary = Record<string, DiaryEntry>;

const Diary = z.record(DiaryEntry);

export type IngredientLibrary = Record<string, Ingredient>;

const IngredientLibrary = z.record(Ingredient);

export { Ingredient, Recipe, Meal, DiaryEntry, Diary, IngredientLibrary };
