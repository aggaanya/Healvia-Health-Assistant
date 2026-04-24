import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../Card';
import { Badge } from '../Badge';
import { User, Activity, Heart, Brain, TrendingUp, TrendingDown, Award, Info } from 'lucide-react';

const UserSummary = ({ summary, period = 'Weekly' }) => {
  const [expandedMetric, setExpandedMetric] = useState(null);

  const defaultSummary = {
    user: {
      name: 'John Doe',
      age: 32,
      goal: 'Improve overall health',
      streak: 15
    },
    metrics: {
      mood: {
        current: 'Good',
        score: 75,
        trend: 'improving',
        change: '+12%',
        icon: Brain,
        color: 'blue'
      },
      sleep: {
        current: '7h 30m',
        score: 85,
        trend: 'stable',
        change: '+5min',
        icon: Heart,
        color: 'blue'
      },
      exercise: {
        current: '35 min',
        score: 78,
        trend: 'improving',
        change: '+10min',
        icon: Activity,
        color: 'blue'
      },
      hydration: {
        current: '7.5 cups',
        score: 94,
        trend: 'stable',
        change: '+0.5',
        icon: Activity,
        color: 'blue'
      }
    },
    achievements: [
      { name: '7-Day Streak', unlocked: true, icon: '🔥' },
      { name: 'Perfect Week', unlocked: true, icon: '⭐' },
      { name: 'Hydration Hero', unlocked: false, icon: '💧' },
      { name: '100% Adherence', unlocked: true, icon: '💊' }
    ],
    overallScore: 82,
    insights: [
      { type: 'positive', message: 'Your sleep quality is excellent!' },
      { type: 'neutral', message: 'Mood tracking shows stable patterns.' },
      { type: 'warning', message: 'Consider increasing exercise duration.' }
    ]
  };

  const data = summary || defaultSummary;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-blue-600';
    if (score >= 60) return 'text-gray-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {data.user.name.charAt(0)}
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  {data.user.name}
                </h2>
                <p className="text-sm text-gray-600">Age {data.user.age} • {data.user.goal}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    🔥 {data.user.streak} day streak
                  </Badge>
                  <Badge className="bg-gray-50 text-gray-700 border border-gray-200 font-medium">
                    {period} Overview
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{data.overallScore}</div>
              <div className="text-xs text-gray-600">Health Score</div>
              <div className="mt-2 w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.overallScore}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-100">
            {data.achievements.map((achievement, idx) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className={`flex-1 p-2 rounded-lg text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 border border-gray-200 opacity-50'
                }`}
              >
                <div className="text-xl mb-1">{achievement.icon}</div>
                <div className="text-xs font-medium text-gray-700">{achievement.name}</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(data.metrics).map(([key, metric], idx) => {
          const MetricIcon = metric.icon;
          const isExpanded = expandedMetric === key;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              <Card
                className="bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedMetric(isExpanded ? null : key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <MetricIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
                      {metric.trend === 'improving' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {metric.trend === 'declining' && <TrendingDown className="h-3 w-3 mr-1" />}
                      {metric.change}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-600 capitalize mb-1">{key}</div>
                      <div className="text-lg font-bold text-gray-900">{metric.current}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Score</span>
                        <span className={`font-bold ${getScoreColor(metric.score)}`}>{metric.score}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.score}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-blue-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Health Insights</h3>
          </div>
          <div className="space-y-2">
            {data.insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  insight.type === 'positive'
                    ? 'bg-blue-50 border-blue-200'
                    : insight.type === 'warning'
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="mt-0.5">
                  {insight.type === 'positive' && <span className="text-blue-600">✓</span>}
                  {insight.type === 'warning' && <span className="text-gray-600">!</span>}
                  {insight.type === 'neutral' && <span className="text-gray-600">•</span>}
                </div>
                <p className="text-xs leading-relaxed text-gray-700">
                  {insight.message}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSummary;