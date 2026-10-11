import Button from "src/Button";
import Icon from "src/Icon";

import styles from "./DropdownAction.module.css";

interface Props {
  label: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  disabled?: boolean
}

export default function DropdownAction({
  icon,
  label,
  ...buttonProps
}: Props) {
  return <Button type="button" className={styles.DropdownAction} {...buttonProps}>
    <Icon component={icon} />
    {label}
  </Button>
}