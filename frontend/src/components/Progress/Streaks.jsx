import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Badge } from '../Badge';
import { Flame, Award, TrendingUp, ChevronDown, ChevronUp, Info, Target } from 'lucide-react';

const Streaks = ({ data = [], title = "Streak Analytics" }) => {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const generateDefaultData = () => {
    const days = 60;
    const categories = ['Exercise', 'Meditation', 'Water', 'Sleep', 'Medication'];
    const result = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      result.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: Math.random() > 0.25,
        categories: categories.map(cat => ({
          name: cat,
          completed: Math.random() > 0.3
        }))
      });
    }
    return result;
  };

  const chartData = data.length > 0 ? data : generateDefaultData();

  const calculateStats = () => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalCompleted = 0;

    chartData.forEach((d) => {
      if (d.completed) {
        tempStreak++;
        totalCompleted++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    for (let i = chartData.length - 1; i >= 0; i--) {
      if (chartData[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    const categoryStreaks = {};
    if (chartData.length > 0 && chartData[0].categories) {
      chartData[0].categories.forEach(cat => {
        let longest = 0;
        let current = 0;
        let temp = 0;

        chartData.forEach((d) => {
          const catData = d.categories.find(c => c.name === cat.name);
          if (catData && catData.completed) {
            temp++;
            if (temp > longest) longest = temp;
          } else {
            temp = 0;
          }
        });

        for (let i = chartData.length - 1; i >= 0; i--) {
          const catData = chartData[i].categories.find(c => c.name === cat.name);
          if (catData && catData.completed) {
            current++;
          } else {
            break;
          }
        }

        categoryStreaks[cat.name] = { longest, current };
      });
    }

    const weeklyAvg = {};
    chartData.forEach(d => {
      if (!weeklyAvg[d.day]) weeklyAvg[d.day] = { completed: 0, total: 0 };
      if (d.completed) weeklyAvg[d.day].completed++;
      weeklyAvg[d.day].total++;
    });

    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyPattern = dayOrder.map(day => ({
      day,
      rate: weeklyAvg[day] ? Math.round((weeklyAvg[day].completed / weeklyAvg[day].total) * 100) : 0
    }));

    const milestones = [
      { days: 7, name: '7-Day Streak', achieved: longestStreak >= 7 },
      { days: 14, name: 'Perfect Week', achieved: longestStreak >= 14 },
      { days: 30, name: 'Hydration Hero', achieved: longestStreak >= 30 },
      { days: 60, name: '100% Adherence', achieved: longestStreak >= 60 }
    ];

    const completionRate = (totalCompleted / chartData.length) * 100;

    return {
      currentStreak,
      longestStreak,
      totalCompleted,
      completionRate: Math.round(completionRate),
      categoryStreaks,
      weeklyPattern,
      milestones,
      daysTracked: chartData.length,
      nextMilestone: milestones.find(m => !m.achieved) || milestones[milestones.length - 1]
    };
  };

  const stats = calculateStats();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || chartData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const padding = 20;
    const chartHeight = height - padding * 2;
    const barWidth = Math.min(width / chartData.length, 12);

    chartData.forEach((d, i) => {
      const x = padding + i * barWidth;
      const isCompleted = d.completed;
      const isHovered = hoveredPoint === i;

      if (isCompleted) {
        ctx.fillStyle = isHovered ? '#3b82f6' : '#60a5fa';
        ctx.fillRect(x, height - padding - chartHeight, barWidth - 2, chartHeight);

        if (isHovered) {
          ctx.strokeStyle = '#1e40af';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 1, height - padding - chartHeight - 1, barWidth, chartHeight + 2);
        }
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(x, height - padding - 10, barWidth - 2, 10);
      }
    });

    if (hoveredPoint !== null) {
      const d = chartData[hoveredPoint];
      const x = padding + hoveredPoint * barWidth;

      const tooltipWidth = 180;
      const tooltipHeight = d.categories ? 100 + d.categories.length * 18 : 80;
      const tooltipX = Math.min(width - tooltipWidth - 10, Math.max(10, x - tooltipWidth / 2));
      const tooltipY = 10;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 10);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px "DM Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(d.date, tooltipX + 14, tooltipY + 22);

      ctx.font = '12px "DM Sans", sans-serif';
      ctx.fillStyle = d.completed ? '#3b82f6' : '#94a3b8';
      ctx.fillText(d.completed ? '✓ Completed' : '✗ Missed', tooltipX + 14, tooltipY + 44);

      if (d.categories) {
        ctx.fillStyle = '#64748b';
        ctx.font = '11px "DM Sans", sans-serif';
        ctx.fillText('Activities:', tooltipX + 14, tooltipY + 66);

        d.categories.forEach((cat, idx) => {
          ctx.fillStyle = cat.completed ? '#3b82f6' : '#ef4444';
          ctx.fillText(
            `${cat.completed ? '✓' : '✗'} ${cat.name}`,
            tooltipX + 14,
            tooltipY + 84 + idx * 18
          );
        });
      }
    }
  }, [chartData, hoveredPoint]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const barWidth = Math.min(canvas.width / chartData.length, 12);
    const index = Math.floor((x - 20) / barWidth);

    setHoveredPoint(index >= 0 && index < chartData.length ? index : null);
  };

  const handleMouseLeave = () => setHoveredPoint(null);

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            <div className="mr-3 p-2 bg-blue-50 rounded-lg">
              <Flame className="h-5 w-5 text-blue-600" />
            </div>
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              <Flame className="h-3 w-3 mr-1" />
              {stats.currentStreak} days
            </Badge>
            <Badge className="bg-gray-50 text-gray-700 border border-gray-200 font-medium">
              <Award className="h-3 w-3 mr-1" />
              Best: {stats.longestStreak}
            </Badge>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {showDetails ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div
          className="relative h-[200px] mb-6 bg-white rounded-lg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <canvas ref={canvasRef} width={800} height={200} className="w-full h-full" />
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Current
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.currentStreak}</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
              <Award className="h-3 w-3" />
              Longest
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.longestStreak}</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Total
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCompleted}</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Rate
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.completionRate}%</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Next: {stats.nextMilestone.name}</span>
            <span>{stats.currentStreak} / {stats.nextMilestone.days} days</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stats.currentStreak / stats.nextMilestone.days) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">Achievements</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stats.milestones.map((milestone, idx) => (
              <motion.div
                key={milestone.days}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg border text-center transition-all ${
                  milestone.achieved
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <div className="text-lg mb-1">
                  {milestone.achieved ? <Award className="h-5 w-5 mx-auto text-blue-600" /> : '🔒'}
                </div>
                <div className="text-xs font-medium">{milestone.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-100 pt-4"
            >
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-3">Category Streaks</div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(stats.categoryStreaks).map(([category, streaks]) => (
                      <div
                        key={category}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <div className="text-xs text-gray-600 mb-1">{category}</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-blue-600">{streaks.current}</span>
                          <span className="text-xs text-gray-500">current (best: {streaks.longest})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-3">Weekly Consistency</div>
                  <div className="grid grid-cols-7 gap-2">
                    {stats.weeklyPattern.map(({ day, rate }) => (
                      <div key={day} className="text-center">
                        <div className="text-xs text-gray-600 mb-1">{day}</div>
                        <div className="h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-end justify-center p-1">
                          <div
                            className="w-full rounded-sm bg-blue-600"
                            style={{ height: `${rate}%` }}
                          />
                        </div>
                        <div className="text-xs font-semibold text-gray-900 mt-1">{rate}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-900 flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {stats.currentStreak >= stats.longestStreak
                      ? 'Amazing! This is your longest streak ever. Keep it going!'
                      : stats.currentStreak >= 7
                      ? `Great job! ${stats.longestStreak - stats.currentStreak} more days to beat your record.`
                      : 'Build momentum! Consistency is key to forming lasting habits.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default Streaks;