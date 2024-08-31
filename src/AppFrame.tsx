import { ReactNode } from "react";

import styles from "./AppFrame.module.css";
interface Props {
  nav: ReactNode;
  main: ReactNode;
}

export default function AppFrame({ nav, main }: Props) {
  return (
    <div className={styles.Wrapper}>
      <nav className={styles.Nav}>{nav}</nav>
      <main className={styles.Main}>{main}</main>
    </div>
  );
}
