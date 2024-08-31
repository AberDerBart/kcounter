import classNames from "classnames";
import { ComponentProps, ReactNode } from "react";

import styles from "./FormInput.module.css";

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
