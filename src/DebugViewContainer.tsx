import { useMemo } from "react";

export default function DebugViewContainer() {
  const rawDiary = useMemo(() => localStorage.getItem("diary"), []);

  const prettyDiary = useMemo(
    () => (rawDiary ? JSON.stringify(JSON.parse(rawDiary), null, 2) : null),
    [rawDiary]
  );
  return (
    <div>
      <pre>{prettyDiary ?? rawDiary}</pre>
    </div>
  );
}
