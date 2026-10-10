import { ReactNode } from 'react';
import styles from './AppFrameHeader.module.css';
import { Link } from 'react-router-dom';
import Icon from '../../Icon';
import { ReactComponent as LeftArrowIcon } from "../../chevron-left.svg";

interface Props {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export default function AppFrameHeader({ children }: React.PropsWithChildren<Props>) {
  return <div className={styles.Header}>
    {children}
  </div>
}

export function NavBack({ to }: { to?: string }) {
  return (
    <Link to={to ?? '..'}>
      <Icon component={LeftArrowIcon} />
    </Link>
  );
}