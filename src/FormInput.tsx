import classNames from "classnames";
import {
  ComponentProps,
  ReactNode,
  useMemo,
} from "react";

import styles from "./FormInput.module.css";
import { useCombobox } from "downshift";

type Props = ComponentProps<"input"> & {
  label?: string;
  leftUi?: ReactNode;
  rightUi?: ReactNode;
  error?: string | false;
};

export default function FormInput({
  className,
  label,
  leftUi,
  rightUi,
  error,
  ...passthroughProps
}: Props) {
  return (
    <div className={classNames(styles.Wrapper, className)}>
      <div>{label}</div>
      <div className={styles.InputWrapper}>
        {leftUi}
        <input
          {...passthroughProps}
          className={classNames(styles.Input, !!error && styles.error)}
        />
        {rightUi}
      </div>
    </div>
  );
}

export function FormInputWithCompletions({
  value,
  label,
  leftUi,
  className,
  completions,
  fallBackCompletion,
  onCompletionSelected,
  ...passthroughProps
}: Omit<Props, "autoComplete"> & {
  value: string;
  completions: { id: string; label: string }[];
  onCompletionSelected: (id: string) => void;
  fallBackCompletion?: { id: string; label: string };
}) {
  const completionsWithFallback = useMemo(() => fallBackCompletion ? [...completions, fallBackCompletion] : completions, [completions, fallBackCompletion]);

  const filteredCompletions = useMemo(() => {
    const lowercaseValue = value.trim().toLowerCase();
    if (lowercaseValue === '') {
      return completionsWithFallback;
    }
    return completionsWithFallback.filter((c) =>
      c.id === fallBackCompletion?.id ||
      c.label.toLowerCase().includes(lowercaseValue)
    );
  }, [value, completionsWithFallback, fallBackCompletion?.id]);

  const { isOpen, getInputProps, getMenuProps, getItemProps } = useCombobox({
    items: filteredCompletions,
    itemToKey: (item) => item?.id,
    itemToString: (item) => item?.label ?? "",
    inputValue: value,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onCompletionSelected(selectedItem.id);
      }
    },
  });

  return (
    <div className={styles.Wrapper}>
      <div>{label}</div>
      <div className={styles.InputWrapper}>
        {leftUi}
        <input
          {...getInputProps({
            ...passthroughProps,
            className: classNames(styles.Input, className),
            autoComplete: "off",
          })}
        />
        {isOpen && filteredCompletions.length > 0 && (
          <ul {...getMenuProps({ className: styles.CompletionsList })}>
            {filteredCompletions.map((c, index) => (
              <li
                key={c.id}
                className={styles.CompletionItem}
                {...getItemProps({ item: c, index })}
              >
                {c.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
