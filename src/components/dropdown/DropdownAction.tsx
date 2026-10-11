import Button from "src/Button";
import Icon from "src/Icon";

import styles from "./DropdownAction.module.css";

interface Props {
  label: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
}

export default function DropdownAction({
  icon,
  label,
  onClick,
}: Props) {
  return <Button type="button" className={styles.DropdownAction} onClick={onClick}>
    <Icon component={icon} />
    Rezept löschen
  </Button>
}