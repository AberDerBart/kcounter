import classNames from "classnames";
import styles from "./Icon.module.css";

export default function Icon({
  component: Component,
  small,
  active,
}: {
  component?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  small?: boolean;
  active?: boolean;
}) {
  return (
    <div className={classNames(styles.Wrapper, small && styles.small)}>
      {Component && (
        <Component className={classNames(styles.Icon, small && styles.small, active && styles.active)} />
      )}
    </div>
  );
}
