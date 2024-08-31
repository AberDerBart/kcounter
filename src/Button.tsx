import classNames from "classnames";
import { ComponentProps } from "react";

import styles from "./Button.module.css";

type Props = ComponentProps<"button">;

export default function Button({ className, ...passthroughProps }: Props) {
  return (
    <button
      className={classNames(styles.Button, className)}
      {...passthroughProps}
    ></button>
  );
}

export function FormButton({ className, ...passthroughProps }: Props) {
  return (
    <Button
      className={classNames(styles.FormButton, className)}
      {...passthroughProps}
    />
  );
}
