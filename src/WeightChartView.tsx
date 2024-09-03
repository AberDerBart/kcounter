import { FlexibleXYPlot, LineMarkSeries, XAxis, YAxis } from "react-vis";
import { Diary } from "./types";
import { useMemo, useState } from "react";
import AppFrame from "./AppFrame";
import { addDays, endOfToday, format, startOfToday } from "date-fns";

import styles from "./WeightChartView.module.css";

interface Props {
  diary: Diary;
}

export default function WeightChartView(props: Props) {
  return <AppFrame nav={<div />} main={<WeightChart {...props} />} />;
}

export function WeightChart({ diary }: Props) {
  const data = useMemo(() => {
    return Object.entries(diary)
      .flatMap(([date, v]) =>
        v.weight ? { x: new Date(date).getTime(), y: v.weight } : []
      )
      .sort((l, r) => (l.x < r.x ? -1 : 1));
  }, [diary]);

  const [range, setRange] = useState<"week" | "month">("week");

  const tickValues = useMemo(() => {
    if (range === "week") {
      return Array.from({ length: 7 }).map((_, i) =>
        addDays(startOfToday(), i - 6).getTime()
      );
    }
    return Array.from({ length: 11 }).map((_, i) =>
      addDays(startOfToday(), i * 3 - 30).getTime()
    );
  }, [range]);

  const filteredData = useMemo(() => {
    const firstDate =
      range === "week"
        ? addDays(startOfToday(), -6).getTime()
        : addDays(startOfToday(), -30).getTime();

    return data.filter(
      (v) => v.x >= firstDate && v.x <= endOfToday().getTime()
    );
  }, [data, range]);

  return (
    <div className={styles.Wrapper}>
      <FlexibleXYPlot>
        <XAxis
          tickValues={tickValues}
          tickFormat={(tick) => format(tick, "E")}
        />
        <YAxis title="kg" />
        <LineMarkSeries data={filteredData} lineStyle={{ fill: "none" }} />
      </FlexibleXYPlot>
    </div>
  );
}
