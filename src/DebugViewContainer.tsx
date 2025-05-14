import { useCallback, useMemo, useState } from "react";
import { formatDate } from "./util";
import { useDiaryStorage } from "./useLocalStorage";
import { Diary } from "./types";

export default function DebugViewContainer() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [diary, setDiary, error] = useDiaryStorage();

  const exportData = useMemo(() => diary ? `data:application/json;charset=UTF-8,${JSON.stringify(diary)}` : null, [diary]);

  const [importOverwrite, setImportOverwrite] = useState(false);

  const importData = useCallback(async (f: File) => {

    const contentPromise = new Promise<string>((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.readAsText(f);
    })

    const content = await contentPromise;

    const importedDiary = Diary.parse(JSON.parse(content));

    const newDiary = importOverwrite ? { ...diary, ...importedDiary } : { ...importedDiary, ...diary }
    setDiary(newDiary);
  }, [diary, importOverwrite, setDiary]);

  return (
    <div>
      <pre>{JSON.stringify(error)}</pre>
      {exportData && <section>
        <h2>Export</h2>
        <a href={exportData} download={`kcounter-export-${formatDate(new Date())}.json`}>Download</a>
      </section>}
      <section>
        <h2>Import</h2>
        <label>
          Overwrite existing entries <input type="checkbox" checked={importOverwrite} onChange={(e) => setImportOverwrite(e.target.checked)} />
        </label>
        <br />
        <br />
        <input
          type="file"
          accept="application/json"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              console.log(e);
              importData(e.target.files[0]);
            }
          }} />
      </section>
    </div >
  );
}
