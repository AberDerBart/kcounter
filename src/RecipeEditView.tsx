import { FieldArray, FieldMetaProps, Formik, FormikErrors, FormikProps } from "formik";
import { Ingredient, IngredientLibrary, Recipe, RecipeLibrary } from "./types";
import FormInput, { FormInputWithCompletions } from "./FormInput";
import Button, { FormButton } from "./Button";
import Icon from "./Icon";
import { ReactComponent as DeleteIcon } from "./delete.svg";

import styles from "./RecipeEditView.module.css";
import AppFrame from "./components/appFrame/AppFrame";
import { v4 } from "uuid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppFrameHeader, { NavBack } from "./components/appFrame/AppFrameHeader";
import useSortedFoodItems from "./util/useSortedFoodItems";
import ReactModal from "react-modal";
import IngredientEditForm from "./components/ingredientEditForm/IngredientEditForm";
import { ReactComponent as TrashIcon } from 'src/delete.svg'
import Dropdown from "./components/dropdown/Dropdown";
import DropdownAction from "./components/dropdown/DropdownAction";
import useCloseOnClickOutside from "./util/hooks/useCloseOnClickOutside";
import { recipeToIngredient } from "./util";

interface Props {
  ingredients: IngredientLibrary;
  recipes: RecipeLibrary;
  recipe?: Recipe;
  save: (recipe: Recipe) => void;
  createIngredient: (ingredient: Ingredient) => void;
  delete?: () => void;
}

export default function RecipeEditView(props: Props) {
  return (
    <AppFrame
      nav={
        <AppFrameHeader>
          <NavBack />
          {!!props.delete &&
            <Dropdown align="right">
              <DropdownAction onClick={props.delete} icon={TrashIcon} label="Rezept löschen" />
            </Dropdown>
          }
        </ AppFrameHeader>
      }
    >
      <RecipeEdit {...props} />
    </AppFrame>
  );
}

export function RecipeEdit({ recipe, save, ...passThroughProps }: Props) {
  return (
    <Formik
      initialValues={recipe ?? { id: v4(), label: "", components: [] }}
      validate={(values) => {
        let errors: FormikErrors<Recipe> = {};
        if (values.label.trim() === "") {
          errors = { ...errors, label: "Gib einen Rezeptnamen ein!" };
        }

        let hasComponentErrors = false;
        let componentErrors: FormikErrors<Recipe['components'][number]>[] = [];
        for (const c of values.components) {
          if (c.amountG > 0) {
            componentErrors.push({});
            return
          }
          hasComponentErrors = true;
          componentErrors.push({ amountG: "Gib ein Gewicht ein!" });
        }
        if (hasComponentErrors) {
          errors = { ...errors, components: componentErrors };
        }

        return errors
      }}
      validateOnBlur
      onSubmit={save}
    >
      {(formik) => <FormContent formik={formik} {...passThroughProps} />}
    </Formik>
  );
}

function FormContent({
  formik,
  ingredients,
  recipes,
  createIngredient,
}: {
  formik: FormikProps<Recipe>;
  ingredients: IngredientLibrary;
  recipes: RecipeLibrary;
  createIngredient: (i: Ingredient) => void;
}) {
  const [newComponentIndex, setNewComponentIndex] = useState<number | undefined>();

  useEffect(() => {
    if (newComponentIndex === undefined) {
      return;
    }
    if (newComponentIndex >= formik.values.components.length) {
      setNewComponentIndex(undefined);
    }
  }, [formik.values.components.length, newComponentIndex])

  const kcalPer100g = useMemo(() => recipeToIngredient(formik.values).kcalPer100g, [formik.values]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormInput
        {...formik.getFieldProps("label")}
        label="Rezept"
        error={formik.touched.label && formik.errors.label}
      />
      <div className={styles.Nutrition}>{kcalPer100g} kcal / 100 g</div>
      <FieldArray
        name="components"
        render={(arrayHelpers) => (
          <>
            {formik.values.components.map((_, index) => (
              <ComponentEdit
                key={index}
                index={index}
                remove={() => arrayHelpers.remove(index)}
                path={`components[${index}]`}
                formik={formik}
                autofocus={index === newComponentIndex}
              />
            ))}
            <div className={styles.Compnent}>
              <AddComponent
                add={(c) => {
                  const newIndex = formik.values.components.length;
                  arrayHelpers.push(c);
                  setNewComponentIndex(newIndex);
                }}
                recipes={recipes}
                ingredients={ingredients}
                createIngredient={createIngredient}
              />
            </div>
          </>
        )}
      />
      <FormButton type="submit" className={styles.SubmitButton} disabled={!formik.isValid}>
        Speichern
      </FormButton>
    </form>
  );
}

function ComponentEdit({
  remove,
  path,
  index,
  formik,
  autofocus,
}: {
  formik: FormikProps<Recipe>;
  index: number;
  path: string;
  remove: () => void;
  autofocus?: boolean;
}) {
  const { ingredient } = formik.values.components[index];
  const meta: FieldMetaProps<Recipe['components'][number]['amountG']> = formik.getFieldMeta(`${path}.amountG`);

  return (
    <div className={styles.Component}>
      {ingredient.label}
      <FormInput
        type="number"
        {...formik.getFieldProps(`${path}.amountG`)}
        placeholder="0"
        className={styles.AmountEdit}
        error={meta.touched && meta.error}
        autoFocus={autofocus}
      />
      <div>g</div>
      <Button type="button" onClick={remove}>
        <Icon component={DeleteIcon} />
      </Button>
    </div>
  );
}

function AddComponent({
  recipes,
  ingredients,
  add,
  createIngredient,
}: {
  recipes: RecipeLibrary;
  ingredients: IngredientLibrary;
  add: (c: Recipe["components"][number]) => void;
  createIngredient: (ingredient: Ingredient) => void;
}) {
  const ingredientItems = useSortedFoodItems({}, ingredients);
  const recipeItems = useSortedFoodItems(recipes, {})
  const foodItems = useMemo(() => {
    return ingredientItems.concat(recipeItems);
  }, [ingredientItems, recipeItems])

  const [newIngredientModalOpen, setNewIngredientModalOpen] = useState(false);

  const createAndAddIngredient = useCallback((ingredient: Ingredient) => {
    setNewIngredientModalOpen(false);
    createIngredient(ingredient);
    setSearchString("");
    add({ ingredient, amountG: 0 });
  }, [add, createIngredient]);

  const [searchString, setSearchString] = useState('');
  return <div>
    <FormInputWithCompletions
      label="Zutat hinzufügen"
      completions={foodItems}
      fallBackCompletion={{ id: 'new', label: 'Zutat erstellen' }}
      value={searchString}
      onChange={(e) => setSearchString(e.target.value)}
      onCompletionSelected={(id) => {
        if (id === 'new') {
          setNewIngredientModalOpen(true);
          return;
        }
        const foodItem = foodItems.find((item) => item.id === id);
        if (!foodItem) {
          return;
        }
        add({ ingredient: foodItem, amountG: 0 });
        setSearchString("");
      }}
    />
    <NewIngredientModal initialLabel={searchString} isOpen={newIngredientModalOpen} add={createAndAddIngredient} close={() => setNewIngredientModalOpen(false)} />
  </div>
}

function NewIngredientModal({ initialLabel, isOpen, add, close }: { initialLabel?: string; isOpen: boolean; add: (ingredient: Ingredient) => void; close: () => void }) {
  const ref = useRef(null);

  useCloseOnClickOutside(ref, close);

  return <ReactModal isOpen={isOpen} className={styles.NewIngredientModal}>
    <div ref={ref}>
      <IngredientEditForm
        save={add}
        ingredient={initialLabel ? { id: v4(), label: initialLabel, kcalPer100g: 0 } : undefined}
      />
    </div>
  </ReactModal>
}