import React from 'react';
import UserSummary from './UserSummary';
import MoodChart from './MoodChart';
import SleepChart from './SleepChart';
import ExerciseChart from './ExerciseChart';
import WaterChart from './WaterChart';
import MedicationChart from './MedicationChart';
import Streaks from './Streaks';
import Tips from './Tips';

const WeeklyTab = ({ data }) => {
  return (
    <div className="space-y-6">
      <UserSummary summary={data?.summary} period="Weekly" />

      <Streaks data={data?.streaks} title="Weekly Consistency" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodChart data={data?.mood} title="Mood Trends (7 Days)" />
        <SleepChart data={data?.sleep} title="Sleep Patterns" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExerciseChart data={data?.exercise} title="Exercise Summary" />
        <WaterChart data={data?.water} title="Hydration Overview" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MedicationChart data={data?.medication} title="Medication Adherence" />
      </div>

      <Tips tips={data?.tips} category="weekly" />
    </div>
  );
};

export default WeeklyTab;