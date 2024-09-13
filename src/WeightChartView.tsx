import {
  FlexibleXYPlot,
  HorizontalGridLines,
  LineMarkSeries,
  LineSeries,
  VerticalGridLines,
  XAxis,
  YAxis,
} from "react-vis";
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

  const averageData = useMemo(() => {
    return data.flatMap(({ x }, index, all) => {
      if (index < 6) {
        return [];
      }
      return {
        x,
        y:
          all
            .slice(index - 6, index + 1)
            .reduce((total, { y }) => total + y, 0) / 7,
      };
    });
  }, data);

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

  const filteredAverage = useMemo(() => {
    const firstDate =
      range === "week"
        ? addDays(startOfToday(), -6).getTime()
        : addDays(startOfToday(), -30).getTime();

    return averageData.filter(
      (v) => v.x >= firstDate && v.x <= endOfToday().getTime()
    );
  }, [averageData, range]);

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
      <FlexibleXYPlot margin={{ left: 70 }}>
        <XAxis tickValues={tickValues} tickFormat={xTickFormat} />
        <YAxis title="kg" />
        <HorizontalGridLines
          style={{ stroke: "lightgray", strokeWidth: 1 }}
          tickValues={[
            0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
          ]}
        />
        <LineSeries
          data={filteredAverage}
          style={{ fill: "none", stroke: "red" }}
        />
        <LineMarkSeries data={filteredData} lineStyle={{ fill: "none" }} />
      </FlexibleXYPlot>
    </div>
  );
}
