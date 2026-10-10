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

const Meal = z.object({
  recipe: Recipe,
  amountG: z
    .number()
    .or(z.string().transform((s) => parseFloat(s)))
    .or(z.null().transform(() => 0)),
  imported: z.boolean().optional(),
});
type Meal = z.infer<typeof Meal>;

interface DiaryEntry {
  weight?: number;
  meals: Meal[];
  poop?: boolean;
  period?: boolean;
}

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

const IngredientLibrary = z.record(Ingredient);
type IngredientLibrary = z.infer<typeof IngredientLibrary>;

interface Settings {
  hideKcal?: boolean;
}
const Settings = z.object({
  hideKcal: z.boolean().optional(),
});

export {
  Ingredient,
  Recipe,
  Meal,
  DiaryEntry,
  Diary,
  IngredientLibrary,
  Settings,
};
