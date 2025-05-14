import { useMemo } from "react";
import { formatDate } from "./util";
import { useDiaryStorage } from "./useLocalStorage";

export default function DebugViewContainer() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [diary, _setDiary, error] = useDiaryStorage();

  const exportData = useMemo(() => diary ? `data:text/json;charset=UTF-8,${JSON.stringify(diary)}` : null, [diary])


  return (
    <div>
      <pre>{JSON.stringify(error)}</pre>
      {exportData && <a href={exportData} download={`kcounter-export-${formatDate(new Date())}.json`}>Export</a>}
    </div>
  );
}
