import AppFrame from "./AppFrame"
import styles from './SettingsView.module.css'

interface Props {
  hideKcal: boolean
  setHideKcal: (enable: boolean) => void;
}

export default function SettingsView({ hideKcal: showKcal, setHideKcal: setShowKcal }: Props) {
  return (
    <AppFrame>
      <label className={styles.Setting}>
        <input
          className={styles.Checkbox}
          type="checkbox"
          checked={showKcal}
          onChange={(e) => setShowKcal(e.target.checked)}
        />
        Hide kcal
      </label>
    </AppFrame>
  );
}
