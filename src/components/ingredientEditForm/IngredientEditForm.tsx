import { Formik, FormikErrors } from "formik";
import { FormButton } from "../../Button";
import FormInput from "../../FormInput";
import { Ingredient } from "../../types";

import styles from './IngredientEditForm.module.css'
import { v4 } from "uuid";

interface Props {
  ingredient?: Ingredient;
  save: (ingredient: Ingredient) => void;
}

export default function IngredientEditForm({ ingredient, save }: Props) {
  return <Formik<Ingredient>
    initialValues={ingredient ?? { id: v4(), label: '', kcalPer100g: 0 }}
    onSubmit={save}
    validate={(values) => {
      let errors: FormikErrors<Ingredient> = {};
      if (!values.label) {
        errors = { ...errors, label: 'Zutaten-Name darf nicht leer sein.' }
      }

      return errors;
    }}
    validateOnBlur
  >
    {(formik) => (
      <form onSubmit={formik.handleSubmit} className={styles.Form}>
        <FormInput
          {...formik.getFieldProps('label')}
          label="Zutat"
          error={formik.touched.label && formik.errors.label}
          autoFocus
        />
        <FormInput {...formik.getFieldProps('kcalPer100g')} label="kCal/100g" />
        <FormButton
          type="submit"
          disabled={!formik.isValid}
          className={styles.SubmitButton}
        >Speichern</FormButton>
      </form>
    )}
  </Formik>
}