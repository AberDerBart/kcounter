import AppFrame from "./AppFrame"
import styles from './SettingsView.module.css'

interface Props {
  hideKcal: boolean
  setHideKcal: (enable: boolean) => void;
}

export default function SettingsView(props: Props) {
  return <AppFrame
    nav={<h1>Settings</h1>}
    main={<SettingsViewInterla {...props} />}
  />
}

function SettingsViewInterla({ hideKcal: showKcal, setHideKcal: setShowKcal }: Props) {
  return <div>
    <label className={styles.Setting}><input className={styles.Checkbox} type="checkbox" checked={showKcal} onChange={(e) => setShowKcal(e.target.checked)} />Hide kcal</label>
  </div>
}