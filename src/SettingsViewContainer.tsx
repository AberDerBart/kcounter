import { useCallback } from "react";
import SettingsView from "./SettingsView";
import { useSettingsStorage } from "./useLocalStorage";

export default function SettingsViewContainer() {
  const [settings, setSettings] = useSettingsStorage();

  const setHideKcal = useCallback((hide: boolean) => {
    setSettings({ ...settings, hideKcal: hide })
  }, [setSettings, settings])

  return <SettingsView hideKcal={settings?.hideKcal ?? false} setHideKcal={setHideKcal} />
}