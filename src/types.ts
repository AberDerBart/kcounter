export interface Ingredient {
  label: string;
  kcalPer100g: number;
}

export interface Recipe {
  label: string;
  components: {
    ingredient: Ingredient;
    amountG: number;
  }[];
}

export interface Meal {
  recipe: Recipe;
  amountG: number;
}

export interface DiaryEntry {
  weight?: number;
  meals: Meal[];
}

export type Diary = Record<string, DiaryEntry>;
