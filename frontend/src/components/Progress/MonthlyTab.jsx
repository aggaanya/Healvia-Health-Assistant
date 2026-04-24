import React from 'react';
import UserSummary from './UserSummary';
import MoodChart from './MoodChart';
import SleepChart from './SleepChart';
import ExerciseChart from './ExerciseChart';
import WaterChart from './WaterChart';
import MedicationChart from './MedicationChart';
import Streaks from './Streaks';
import Tips from './Tips';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Badge } from '../Badge';
import { TrendingUp, TrendingDown, Award, Calendar } from 'lucide-react';

const MonthlyTab = ({ data }) => {
  const monthlySummary = data?.monthlySummary || {
    improvements: [
      { metric: 'Sleep Quality', change: '+15%', trend: 'up' },
      { metric: 'Exercise Consistency', change: '+22%', trend: 'up' },
      { metric: 'Medication Adherence', change: '+8%', trend: 'up' }
    ],
    declines: [
      { metric: 'Hydration', change: '-5%', trend: 'down' }
    ],
    achievements: [
      { name: 'Perfect Week', count: 2 },
      { name: 'Longest Streak', count: 21 }
    ]
  };

  return (
    <div className="space-y-6">
      <UserSummary summary={data?.summary} period="Monthly" />

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Monthly Highlights
            </CardTitle>
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              30 Days
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center text-blue-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                Improvements
              </h4>
              <div className="space-y-2">
                {monthlySummary.improvements.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-100"
                  >
                    <span className="text-xs font-medium text-gray-900">{item.metric}</span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">
                      {item.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center text-gray-600">
                <Award className="h-4 w-4 mr-1" />
                Achievements
              </h4>
              <div className="space-y-2">
                {monthlySummary.achievements.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <span className="text-xs font-medium text-gray-900">{item.name}</span>
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200 font-medium">
                      ×{item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {monthlySummary.declines.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold mb-3 flex items-center text-gray-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                Focus Areas
              </h4>
              <div className="space-y-2">
                {monthlySummary.declines.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <span className="text-xs font-medium text-gray-900">{item.metric}</span>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200 font-medium">
                      {item.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Streaks data={data?.streaks} title="Monthly Consistency" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodChart data={data?.mood} title="Mood Analysis (30 Days)" />
        <SleepChart data={data?.sleep} title="Sleep Trends" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExerciseChart data={data?.exercise} title="Exercise Overview" />
        <WaterChart data={data?.water} title="Hydration Stats" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MedicationChart data={data?.medication} title="Adherence Tracking" />
      </div>

      <Tips tips={data?.tips} category="monthly" />
    </div>
  );
};

export default MonthlyTab;