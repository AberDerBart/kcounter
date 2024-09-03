import { FieldArray, Formik, FormikProps } from "formik";
import { Meal } from "./types";
import FormInput from "./FormInput";
import Button, { FormButton } from "./Button";
import Icon from "./Icon";
import { ReactComponent as DeleteIcon } from "./delete.svg";
import { ReactComponent as PlusIcon } from "./plus.svg";

import styles from "./MealEditView.module.css";
import AppFrame from "./AppFrame";
import { ReactComponent as CloseIcon } from "./close.svg";
import { Link } from "react-router-dom";

const EMPTY_MEAL: Meal = {
  amountG: 0,
  recipe: {
    label: "",
    components: [{ amountG: 0, ingredient: { label: "", kcalPer100g: 0 } }],
  },
};

interface Props {
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

export function MealEdit({ initialMeal, save }: Props) {
  return (
    <Formik initialValues={initialMeal ?? EMPTY_MEAL} onSubmit={save}>
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <FormInput
            {...formik.getFieldProps("recipe.label")}
            label="Rezept"
            className={styles.FormInput}
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
}: {
  formik: FormikProps<Meal>;
  path: string;
  remove: () => void;
}) {
  return (
    <div className={styles.Component}>
      <FormInput
        label="Zutat"
        {...formik.getFieldProps(`${path}.ingredient.label`)}
        className={styles.Input}
      />
      <FormInput
        type="number"
        label="Menge (g)"
        {...formik.getFieldProps(`${path}.amountG`)}
        className={styles.Input}
      />
      <FormInput
        type="number"
        label="kcal/100g"
        {...formik.getFieldProps(`${path}.ingredient.kcalPer100g`)}
        className={styles.Input}
      />
      <Button type="button" onClick={remove}>
        <Icon component={DeleteIcon} />
      </Button>
    </div>
  );
}
