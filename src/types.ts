import { z } from "zod";
import { v4 } from "uuid";

const Ingredient = z.object({
  id: z.string().uuid().default(v4()),
  label: z.string(),
  kcalPer100g: z
    .number()
    .or(z.string().transform((s) => parseFloat(s)))
    .or(z.null().transform(() => 0)),
});
type Ingredient = z.infer<typeof Ingredient>;

const IngredientLibrary = z.record(Ingredient);
type IngredientLibrary = z.infer<typeof IngredientLibrary>;

const Recipe = z.object({
  id: z.string().uuid().default(v4()),
  label: z.string(),
  components: z.array(
    z.object({
      ingredient: Ingredient,
      amountG: z
        .number()
        .or(z.string().transform((s) => parseFloat(s)))
        .or(z.null().transform(() => 0)),
    }),
  ),
});
type Recipe = z.infer<typeof Recipe>;

const RecipeLibrary = z.record(Recipe);
type RecipeLibrary = z.infer<typeof RecipeLibrary>;

const Meal = z.object({
  recipe: Recipe,
  amountG: z
    .number()
    .or(z.string().transform((s) => parseFloat(s)))
    .or(z.null().transform(() => 0)),
  imported: z.boolean().optional(),
});
type Meal = z.infer<typeof Meal>;

const Portion = z.object({
  type: z.literal("weight"),
  amountG: z.number(),
});
type Portion = z.infer<typeof Portion>;

const MealV2 = z.object({
  food: z.object({
    label: z.string(),
    type: z.enum(["recipe", "ingredient"]),
    id: z.string().uuid(),
    kcalPer100g: z.number(),
  }),
  portions: z.array(Portion),
});
type MealV2 = z.infer<typeof MealV2>;

const DiaryEntry = z.object({
  weight: z
    .number()
    .or(z.string().transform((s) => parseFloat(s)))
    .or(z.null().transform(() => 0))
    .optional(),
  meals: z.array(Meal),
  poop: z.boolean().optional(),
  period: z.boolean().optional(),
});
type DiaryEntry = z.infer<typeof DiaryEntry>;

const Diary = z.record(DiaryEntry);
type Diary = z.infer<typeof Diary>;

const DiaryEntryV2 = z.object({
  weight: z.number().optional(),
  meals: z.array(MealV2),
  poop: z.boolean(),
  period: z.boolean(),
});
type DiaryEntryV2 = z.infer<typeof DiaryEntryV2>;

const DiaryV2 = z.record(DiaryEntryV2);
type DiaryV2 = z.infer<typeof DiaryV2>;

interface Settings {
  hideKcal?: boolean;
}
const Settings = z.object({
  hideKcal: z.boolean().optional(),
});

export {
  Ingredient,
  IngredientLibrary,
  Recipe,
  RecipeLibrary,
  Portion,
  Meal,
  MealV2,
  DiaryEntry,
  DiaryEntryV2,
  Diary,
  DiaryV2,
  Settings,
};
