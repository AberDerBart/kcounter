import { ReactNode, useRef, useState } from "react";

import styles from "./Dropdown.module.css";
import classNames from "classnames";
import Button from "src/Button";
import { ReactComponent as DotsIcon } from 'src/icons/dots-vertical.svg'
import Icon from "src/Icon";
import useCloseOnClickOutside from "src/util/hooks/useCloseOnClickOutside";

interface Props {
  renderButton?: (props: { isOpen: boolean; setOpen: (v: boolean) => void }) => ReactNode;
  align: 'left' | 'right';
}

export default function Dropdown({ align, children, renderButton }: React.PropsWithChildren<Props>) {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useCloseOnClickOutside(ref, () => setOpen(false));

  return (
    <div className={styles.DropdownWrapper} ref={ref}>
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