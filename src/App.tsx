import { Navigate, Route, Routes } from "react-router-dom";
import { formatDate } from "./util";
import { useDiaryStorage } from "./useLocalStorage";
import WeightChartView from "./WeightChartView";
import DebugViewContainer from "./DebugViewContainer";
import MealImportContainer from "./MealImportContainer";
import SettingsViewContainer from "./SettingsViewContainer";
import FoodListViewContainer from "./containers/FoodListViewContainer";
import useMigrate from "./useMigrate";
import DiaryPageViewContainer from "./containers/DiaryPageViewContainer";

export default function App() {
  const [diary, setDiary] = useDiaryStorage();

  useMigrate();

  return (
    <Routes>
      {!!diary && (
        <>
          <Route
            path="diary/:date/*"
            element={<DiaryPageViewContainer diary={diary} setDiary={setDiary} />}
          />
          <Route path="chart" element={<WeightChartView diary={diary} />} />
          <Route
            path="import/meal"
            element={<MealImportContainer diary={diary} setDiary={setDiary} />}
          />
          <Route
            path="settings"
            element={<SettingsViewContainer />}
          />
        </>
      )}
      <Route
        path="/diary"
        element={<Navigate to={`${formatDate(new Date())}`} replace={true} />}
      />
      <Route path="/food/*" element={<FoodListViewContainer />} />
      <Route path="/debug" element={<DebugViewContainer />} />
      <Route path="/" element={<Navigate to={!!diary ? "diary" : "debug"} />} />
    </Routes>
  );
}

