import { ReactNode, useState } from "react";

import styles from "./Dropdown.module.css";
import classNames from "classnames";
import Button from "src/Button";
import { ReactComponent as DotsIcon } from 'src/icons/dots-vertical.svg'
import Icon from "src/Icon";

interface Props {
  renderButton?: (props: { isOpen: boolean; setOpen: (v: boolean) => void }) => ReactNode;
  align: 'left' | 'right';
}

export default function Dropdown({ align, children, renderButton }: React.PropsWithChildren<Props>) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className={styles.DropdownWrapper}>
      {renderButton ? renderButton({ isOpen, setOpen }) : <DefaultDropdownButton isOpen={isOpen} setOpen={setOpen} />}
      {isOpen && (
        <div className={classNames(styles.Dropdown, styles[align])}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DefaultDropdownButton({ isOpen, setOpen }: { isOpen: boolean; setOpen: (open: boolean) => void }) {
  return (
    <Button type="button" onClick={() => setOpen(!isOpen)}>
      <Icon component={DotsIcon} />
    </Button>
  );
}