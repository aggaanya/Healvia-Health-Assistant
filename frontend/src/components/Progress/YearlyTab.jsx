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
import { Calendar, TrendingUp, Award } from 'lucide-react';

const YearlyTab = ({ data }) => {
  const yearlySummary = data?.yearlySummary || {
    totalDays: 365,
    streakDays: 234,
    achievements: [
      { name: '100-Day Streak', achieved: true },
      { name: 'Perfect Month', count: 3 },
      { name: 'Health Champion', achieved: true }
    ],
    improvements: [
      { metric: 'Overall Health', change: '+35%' },
      { metric: 'Sleep Quality', change: '+28%' },
      { metric: 'Exercise Consistency', change: '+45%' }
    ]
  };

  return (
    <div className="space-y-6">
      <UserSummary summary={data?.summary} period="Yearly" />

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Year in Review
            </CardTitle>
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              12 Months
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {yearlySummary.totalDays}
              </div>
              <div className="text-sm text-gray-600">Days Tracked</div>
            </div>

            <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {yearlySummary.streakDays}
              </div>
              <div className="text-sm text-gray-600">Days Completed</div>
            </div>

            <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Math.round((yearlySummary.streakDays / yearlySummary.totalDays) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center text-blue-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                Major Improvements
              </h4>
              <div className="space-y-2">
                {yearlySummary.improvements.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100"
                  >
                    <span className="text-sm font-medium text-gray-900">{item.metric}</span>
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
                Yearly Achievements
              </h4>
              <div className="space-y-2">
                {yearlySummary.achievements.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    {item.count ? (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200 font-medium">
                        ×{item.count}
                      </Badge>
                    ) : (
                      <span className="text-lg">🏆</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Streaks data={data?.streaks} title="Yearly Consistency" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodChart data={data?.mood} title="Annual Mood Trends" />
        <SleepChart data={data?.sleep} title="Sleep Patterns (12 Months)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExerciseChart data={data?.exercise} title="Yearly Exercise" />
        <WaterChart data={data?.water} title="Hydration Yearly" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MedicationChart data={data?.medication} title="Annual Adherence" />
      </div>

      <Tips tips={data?.tips} category="yearly" />
    </div>
  );
};

export default YearlyTab;