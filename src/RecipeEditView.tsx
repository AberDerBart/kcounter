import { FieldArray, Formik, FormikProps } from "formik";
import { Ingredient, IngredientLibrary, Recipe, RecipeLibrary } from "./types";
import FormInput, { FormInputWithCompletions } from "./FormInput";
import Button, { FormButton } from "./Button";
import Icon from "./Icon";
import { ReactComponent as DeleteIcon } from "./delete.svg";

import styles from "./RecipeEditView.module.css";
import AppFrame from "./components/appFrame/AppFrame";
import { v4 } from "uuid";
import { useCallback, useMemo, useState } from "react";
import AppFrameHeader, { NavBack } from "./components/appFrame/AppFrameHeader";
import useSortedFoodItems from "./util/useSortedFoodItems";
import ReactModal from "react-modal";
import IngredientEditForm from "./components/ingredientEditForm/IngredientEditForm";

interface Props {
  ingredients: IngredientLibrary;
  recipes: RecipeLibrary;
  recipe?: Recipe;
  save: (recipe: Recipe) => void;
  createIngredient: (ingredient: Ingredient) => void;
}

export default function RecipeEditView({ ...passthroughProps }: Props) {
  return (
    <AppFrame
      nav={<AppFrameHeader><NavBack /></AppFrameHeader>}
    >
      <RecipeEdit {...passthroughProps} />
    </AppFrame>
  );
}

export function RecipeEdit({ recipe, save, recipes, ingredients, createIngredient }: Props) {
  return (
    <Formik
      initialValues={recipe ?? { id: v4(), label: "", components: [] }}
      onSubmit={save}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <FormInput
            {...formik.getFieldProps("label")}
            label="Rezept"
            className={styles.FormInput}
          />
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
                  />
                ))}
                <div className={styles.Compnent}>
                  <AddComponent
                    add={arrayHelpers.push}
                    recipes={recipes}
                    ingredients={ingredients}
                    createIngredient={createIngredient}
                  />
                </div>
              </>
            )}
          />
          <FormButton type="submit" className={styles.SubmitButton}>
            Speichern
          </FormButton>
        </form>
      )}
    </Formik>
  );
}

function ComponentEdit({
  remove,
  path,
  index,
  formik,
}: {
  formik: FormikProps<Recipe>;
  index: number;
  path: string;
  remove: () => void;
}) {
  const { ingredient } = formik.values.components[index];

  return (
    <div className={styles.Component}>
      {ingredient.label}
      <FormInput
        {...formik.getFieldProps(`${path}.amountG`)}
        placeholder="0"
        className={styles.AmountEdit}
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
    add({ ingredient, amountG: 0 });
  }, [add, createIngredient]);

  const [searchString, setSearchString] = useState('');
  return <div>
    <FormInputWithCompletions
      className={styles.FormInput}
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
    <NewIngredientModal initialLabel={searchString} isOpen={newIngredientModalOpen} add={createAndAddIngredient} />
  </div>
}

function NewIngredientModal({ initialLabel, isOpen, add }: { initialLabel?: string; isOpen: boolean; add: (ingredient: Ingredient) => void }) {
  return <ReactModal isOpen={isOpen} className={styles.NewIngredientModal} >
    <IngredientEditForm
      save={add}
      ingredient={initialLabel ? { id: v4(), label: initialLabel, kcalPer100g: 0 } : undefined}
    />
  </ReactModal>
}