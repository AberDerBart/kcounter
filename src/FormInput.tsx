import classNames from "classnames";
import {
  ComponentProps,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./FormInput.module.css";
import Button from "./Button";
import { useCombobox } from "downshift";

type Props = ComponentProps<"input"> & { label?: string; leftUi?: ReactNode };

export default function FormInput({
  className,
  label,
  leftUi,
  ...passthroughProps
}: Props) {
  return (
    <div className={styles.Wrapper}>
      <div>{label}</div>
      <div className={styles.InputWrapper}>
        {leftUi}
        <input
          {...passthroughProps}
          className={classNames(styles.Input, className)}
        />
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
  onCompletionSelected,
  ...passthroughProps
}: Omit<Props, "autoComplete"> & {
  value: string;
  completions: { id: string; label: string }[];
  onCompletionSelected: (id: string) => void;
}) {
  const filteredCompletions = useMemo(() => {
    const lowercaseValue = value.toLowerCase();
    return completions.filter((c) =>
      c.label.toLowerCase().includes(lowercaseValue)
    );
  }, [value, completions]);

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
