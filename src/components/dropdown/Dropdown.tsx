import { ReactNode, useState } from "react";

import styles from "./Dropdown.module.css";
import classNames from "classnames";

interface Props {
  renderButton: (props: { isOpen: boolean; setOpen: (v: boolean) => void }) => ReactNode;
  align: 'left' | 'right';
}

export default function Dropdown({ align, children, renderButton }: React.PropsWithChildren<Props>) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className={styles.DropdownWrapper}>
      {renderButton({ isOpen, setOpen })}
      {isOpen && (
        <div className={classNames(styles.Dropdown, styles[align])}>
          {children}
        </div>
      )}
    </div>
  );
}