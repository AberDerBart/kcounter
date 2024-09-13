import { useMemo } from "react";

export default function DebugViewContainer({ error }: { error: unknown }) {
  const rawDiary = useMemo(() => localStorage.getItem("diary"), []);

  const prettyDiary = useMemo(
    () => (rawDiary ? JSON.stringify(JSON.parse(rawDiary), null, 2) : null),
    [rawDiary]
  );
  return (
    <div>
      <pre>{JSON.stringify(error)}</pre>
      <pre>{prettyDiary ?? rawDiary}</pre>
    </div>
  );
}
