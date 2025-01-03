import {
  FlexibleXYPlot,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
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

type DateRange = "week" | "month" | "year";

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
          <Button
            className={classNames(
              styles.RangeButton,
              range === "year" && styles.active
            )}
            onClick={() => setRange("year")}
          >
            Jahr
          </Button>
        </div>
      }
      main={<WeightChart {...props} range={range} />}
    />
  );
}

export function WeightChart({ diary, range }: Props & { range: DateRange }) {
  const minWeight = useMemo(
    () =>
      Object.values(diary).reduce((minWeight: number | undefined, entry) => {
        if (!entry.weight) {
          return minWeight;
        }
        if (!minWeight) {
          return entry.weight;
        }
        if (entry.weight < minWeight) {
          return entry.weight;
        }
        return minWeight;
      }, undefined),
    [diary]
  );

  const data = useMemo(() => {
    return Object.entries(diary)
      .flatMap(([date, v]) =>
        v.weight ? { x: new Date(date).getTime(), y: v.weight } : []
      )
      .sort((l, r) => (l.x < r.x ? -1 : 1));
  }, [diary]);

  const poopData = useMemo(() => {
    return Object.entries(diary)
      .flatMap(([date, v]) =>
        v.poop
          ? { x: new Date(date).getTime(), y: minWeight ? minWeight - 2 : 0 }
          : []
      )
      .sort((l, r) => (l.x < r.x ? -1 : 1));
  }, [diary, minWeight]);

  const periodData = useMemo(() => {
    return Object.entries(diary)
      .flatMap(([date, v]) =>
        v.period
          ? { x: new Date(date).getTime(), y: minWeight ? minWeight - 4 : 0 }
          : []
      )
      .sort((l, r) => (l.x < r.x ? -1 : 1));
  }, [diary, minWeight]);

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
  }, [data]);

  const tickValues = useMemo(() => {
    if (range === "week") {
      return Array.from({ length: 7 }).map((_, i) =>
        addDays(startOfToday(), i - 6).getTime()
      );
    }
    if (range === "month") {
      return Array.from({ length: 5 }).map((_, i) =>
        addDays(startOfToday(), i * 7 - 30).getTime()
      );
    }
    return Array.from({ length: 6 }).map((_, i) =>
      addDays(startOfToday(), i * 60 - 365).getTime()
    );
  }, [range]);

  const firstDate = useMemo(
    () =>
      range === "week"
        ? addDays(startOfToday(), -6).getTime()
        : range === "month"
        ? addDays(startOfToday(), -30).getTime()
        : addDays(startOfToday(), -365).getTime(),
    [range]
  );

  const filterData = useCallback(
    (d: { x: number; y: number }[]) => {
      return d.filter((v) => v.x >= firstDate && v.x <= endOfToday().getTime());
    },
    [firstDate]
  );

  const filteredData = useMemo(() => filterData(data), [data, filterData]);

  const filteredAverage = useMemo(
    () => filterData(averageData),
    [averageData, filterData]
  );

  const filteredPoops = useMemo(
    () => filterData(poopData),
    [poopData, filterData]
  );

  const filteredPeriods = useMemo(
    () => filterData(periodData),
    [filterData, periodData]
  );

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
        <LineSeries data={filteredData} style={{ fill: "none" }} />
        <MarkSeries
          data={filteredPoops}
          style={{ fill: "peru", stroke: "peru" }}
        />
        <MarkSeries
          data={filteredPeriods}
          style={{ fill: "red", stroke: "red" }}
        />
      </FlexibleXYPlot>
    </div>
  );
}
