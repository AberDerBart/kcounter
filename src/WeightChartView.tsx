import { FlexibleXYPlot, LineMarkSeries, XAxis, YAxis } from "react-vis";
import { Diary } from "./types";
import { useCallback, useMemo, useState } from "react";
import AppFrame from "./AppFrame";
import { addDays, endOfToday, format, startOfToday } from "date-fns";

import styles from "./WeightChartView.module.css";
import Button from "./Button";
import classNames from "classnames";

type DateRange = "week" | "month";

interface Props {
  diary: Diary;
}

export default function WeightChartView(props: Props) {
  const [range, setRange] = useState<DateRange>("week");

  return (
    <AppFrame
      nav={
        <div className={styles.Header}>
          <Button
            className={classNames(
              styles.RangeButton,
              range === "week" && styles.active
            )}
            onClick={() => setRange("week")}
          >
            Woche
          </Button>
          <Button
            className={classNames(
              styles.RangeButton,
              range === "month" && styles.active
            )}
            onClick={() => setRange("month")}
          >
            Monat
          </Button>
        </div>
      }
      main={<WeightChart {...props} range={range} />}
    />
  );
}

export function WeightChart({ diary, range }: Props & { range: DateRange }) {
  const data = useMemo(() => {
    return Object.entries(diary)
      .flatMap(([date, v]) =>
        v.weight ? { x: new Date(date).getTime(), y: v.weight } : []
      )
      .sort((l, r) => (l.x < r.x ? -1 : 1));
  }, [diary]);

  const tickValues = useMemo(() => {
    if (range === "week") {
      return Array.from({ length: 7 }).map((_, i) =>
        addDays(startOfToday(), i - 6).getTime()
      );
    }
    return Array.from({ length: 5 }).map((_, i) =>
      addDays(startOfToday(), i * 7 - 30).getTime()
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

  const xTickFormat = useCallback(
    (tick: number) => {
      if (range === "week") {
        return format(tick, "E");
      }

      return format(tick, "d.M.");
    },
    [range]
  );

  return (
    <div className={styles.Wrapper}>
      <FlexibleXYPlot>
        <XAxis tickValues={tickValues} tickFormat={xTickFormat} />
        <YAxis title="kg" />
        <LineMarkSeries data={filteredData} lineStyle={{ fill: "none" }} />
      </FlexibleXYPlot>
    </div>
  );
}
