import classNames from "classnames";

import styles from './Checkbox.module.css';

export default function Checkbox(
  { className, ...passthrough }: Omit<React.ComponentProps<'input'> & { type: 'checkbox' }, 'type'>
) {
  return (
    <input
      type="checkbox"
      {...passthrough}
      className={classNames(styles.Checkbox, className)}
    />
  );
}