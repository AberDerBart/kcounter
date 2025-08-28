import { ReactNode } from "react";

import { ReactComponent as ChartIcon } from "./chart-line.svg";
import { ReactComponent as NotebookIcon } from "./notebook.svg";
import { ReactComponent as SettingsIcon } from "./cog.svg";

import styles from "./AppFrame.module.css";
import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import classNames from "classnames";
interface Props {
  nav: ReactNode;
  main: ReactNode;
}

export default function AppFrame({ nav, main }: Props) {
  return (
    <div className={styles.Wrapper}>
      <nav className={styles.Nav}>{nav}</nav>
      <main className={styles.Main}>{main}</main>
      <nav className={styles.BottomNav}>
        <NavLink
          to="/diary"
          className={({ isActive }) =>
            classNames(styles.NavLink, isActive && styles.active)
          }
        >
          <Icon component={NotebookIcon} />
        </NavLink>
        <NavLink
          to="/chart"
          className={({ isActive }) =>
            classNames(styles.NavLink, isActive && styles.active)
          }
        >
          <Icon component={ChartIcon} />
        </NavLink>
        <NavLink to="/settings"
          className={({ isActive }) =>
            classNames(styles.NavLink, isActive && styles.active)
          }
        >
          <Icon component={SettingsIcon} />
        </NavLink>
      </nav>
    </div>
  );
}
