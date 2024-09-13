import { FieldArray, Formik, FormikProps } from "formik";
import { Ingredient, IngredientLibrary, Meal } from "./types";
import FormInput, { FormInputWithCompletions } from "./FormInput";
import Button, { FormButton } from "./Button";
import Icon from "./Icon";
import { ReactComponent as DeleteIcon } from "./delete.svg";
import { ReactComponent as PlusIcon } from "./plus.svg";

import styles from "./MealEditView.module.css";
import AppFrame from "./AppFrame";
import { ReactComponent as CloseIcon } from "./close.svg";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { useCallback, useMemo } from "react";

type EditMeal = {
  amountG: number | undefined;
  recipe: {
    label: string;
    components: {
      amountG: number | undefined;
      ingredient: {
        kcalPer100g: number | undefined;
        label: string;
        id?: string;
      };
    }[];
  };
};

const EMPTY_MEAL: EditMeal = {
  amountG: undefined,
  recipe: {
    label: "",
    components: [
      { amountG: undefined, ingredient: { label: "", kcalPer100g: undefined } },
    ],
  },
};

interface Props {
  ingredientLibrary: IngredientLibrary;
  initialMeal?: Meal;
  save: (meal: Meal) => void;
}

export default function MealEditView({ ...passthroughProps }: Props) {
  return (
    <AppFrame
      main={<MealEdit {...passthroughProps} />}
      nav={
        <div className={styles.Header}>
          <Link to="..">
            <Icon component={CloseIcon} />
          </Link>
        </div>
      }
    />
  );
}

export function MealEdit({ initialMeal, save, ingredientLibrary }: Props) {
  return (
    <Formik
      initialValues={initialMeal ?? EMPTY_MEAL}
      onSubmit={(values) => save(completeEditMeal(values))}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <FormInput
            {...formik.getFieldProps("recipe.label")}
            label="Rezept"
            className={styles.FormInput}
            placeholder={`${completeEditMeal(formik.values).recipe.label}`}
          />
          <FieldArray
            name="recipe.components"
            render={(arrayHelpers) => (
              <>
                {formik.values.recipe.components.map((_, index) => (
                  <ComponentEdit
                    key={index}
                    remove={() => arrayHelpers.remove(index)}
                    path={`recipe.components[${index}]`}
                    formik={formik}
                    ingredientLibrary={ingredientLibrary}
                  />
                ))}

                <div className={styles.Compnent}>
                  <Button
                    type="button"
                    onClick={() =>
                      arrayHelpers.push({
                        ingredient: { label: "", kcalPer100g: 0 },
                        amountG: 0,
                      })
                    }
                  >
                    <Icon component={PlusIcon} />
                  </Button>
                </div>
              </>
            )}
          />

          <FormInput
            {...formik.getFieldProps("amountG")}
            type="number"
            label="Gegessene Menge (g)"
            placeholder={`${completeEditMeal(formik.values).amountG}`}
          />
          <FormButton type="submit">Speichern</FormButton>
        </form>
      )}
    </Formik>
  );
}

function ComponentEdit({
  remove,
  path,
  formik,
  ingredientLibrary,
}: {
  formik: FormikProps<EditMeal>;
  path: string;
  remove: () => void;
  ingredientLibrary: IngredientLibrary;
}) {
  const datalistId = useMemo(v4, []);
  const ingredientCompletions = useMemo(
    () =>
      Object.values(ingredientLibrary).map((s) => ({
        id: s.id,
        label: s.label,
      })),
    [ingredientLibrary]
  );

  const selectIngredient = useCallback(
    (id: string) => {
      const selectedIngredient = ingredientLibrary[id] as
        | Ingredient
        | undefined;
      console.log(selectedIngredient);
      if (!selectedIngredient) {
        return;
      }
      formik.setFieldValue(
        `${path}.ingredient.label`,
        selectedIngredient.label
      );
      formik.setFieldValue(
        `${path}.ingredient.kcalPer100g`,
        selectedIngredient.kcalPer100g
      );
      formik.setFieldValue(`${path}.ingredient.id`, selectedIngredient.id);
    },
    [formik, ingredientLibrary, path]
  );

  return (
    <div className={styles.Component}>
      <FormInputWithCompletions
        label="Zutat"
        {...formik.getFieldProps(`${path}.ingredient.label`)}
        className={styles.Input}
        list={datalistId}
        completions={ingredientCompletions}
        onCompletionSelected={selectIngredient}
      />
      <FormInput
        type="number"
        label="Menge (g)"
        {...formik.getFieldProps(`${path}.amountG`)}
        className={styles.Input}
        placeholder="0"
      />
      <FormInput
        type="number"
        label="kcal/100g"
        {...formik.getFieldProps(`${path}.ingredient.kcalPer100g`)}
        className={styles.Input}
        placeholder="0"
      />
      <Button type="button" onClick={remove}>
        <Icon component={DeleteIcon} />
      </Button>
    </div>
  );
}

function completeEditMeal(editMeal: EditMeal): Meal {
  let firstIngredient: { id?: string; label: string } | undefined =
    editMeal.recipe.components[0]?.ingredient;
  let firstIngredientId = firstIngredient.id ?? v4();
  let recipeId =
    !!firstIngredient &&
    (firstIngredient.label === editMeal.recipe.label || !editMeal.recipe.label)
      ? firstIngredientId
      : v4();
  return Meal.parse({
    amountG:
      editMeal.amountG ??
      editMeal.recipe.components.reduce(
        (totalWeight, c) => totalWeight + (c.amountG ?? 0),
        0
      ),
    recipe: {
      id: recipeId,
      label:
        editMeal.recipe.label ||
        editMeal.recipe.components[0]?.ingredient.label,
      components: editMeal.recipe.components.map((c, index) => ({
        amountG: c.amountG ?? 0,
        ingredient: {
          label: c.ingredient.label,
          kcalPer100g: c.ingredient.kcalPer100g ?? 0,
          id: index === 0 ? firstIngredientId : c.ingredient.id ?? v4(),
        },
      })),
    },
  });
}
