import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Badge } from '../Badge';
import { Moon, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Info } from 'lucide-react';

const SleepChart = ({ data = [], title = "Sleep Analytics" }) => {
  const canvasRef = useRef(null);
  const heatmapRef = useRef(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeView, setActiveView] = useState('bars');

  const generateDefaultData = () => {
    const days = 30;
    const result = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const hours = 5 + Math.random() * 4;
      result.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: parseFloat(hours.toFixed(1)),
        quality: hours >= 7 ? 'Good' : hours >= 6 ? 'Fair' : 'Poor',
        deepSleep: 15 + Math.floor(Math.random() * 15),
        remSleep: 15 + Math.floor(Math.random() * 10),
        interruptions: Math.floor(Math.random() * 4)
      });
    }
    return result;
  };

  const chartData = data.length > 0 ? data : generateDefaultData();

  const calculateStats = () => {
    const avgHours = chartData.reduce((sum, d) => sum + d.hours, 0) / chartData.length;
    const qualityCounts = chartData.reduce((acc, d) => {
      acc[d.quality] = (acc[d.quality] || 0) + 1;
      return acc;
    }, { Good: 0, Fair: 0, Poor: 0 });

    const goalHours = 7.5;
    const sleepDebt = chartData.reduce((debt, d) => {
      return debt + Math.max(0, goalHours - d.hours);
    }, 0);

    const recentData = chartData.slice(-7);
    const recentAvg = recentData.reduce((sum, d) => sum + d.hours, 0) / recentData.length;
    const prevAvg = chartData.slice(-14, -7).reduce((sum, d) => sum + d.hours, 0) / 7;
    const trend = recentAvg > prevAvg + 0.3 ? 'improving' : recentAvg < prevAvg - 0.3 ? 'declining' : 'stable';

    const weeklyPattern = {};
    chartData.forEach(d => {
      if (!weeklyPattern[d.day]) weeklyPattern[d.day] = { total: 0, count: 0 };
      weeklyPattern[d.day].total += d.hours;
      weeklyPattern[d.day].count++;
    });

    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyAvg = dayOrder.map(day => ({
      day,
      avg: weeklyPattern[day] ? (weeklyPattern[day].total / weeklyPattern[day].count) : 0
    }));

    return {
      avgHours: avgHours.toFixed(1),
      qualityCounts,
      sleepDebt: sleepDebt.toFixed(1),
      trend,
      weeklyAvg,
      consistency: Math.round((qualityCounts.Good / chartData.length) * 100)
    };
  };

  const stats = calculateStats();

  const qualityColors = {
    Good: '#3b82f6',
    Fair: '#60a5fa',
    Poor: '#93c5fd'
  };

  useEffect(() => {
    if (activeView !== 'bars') return;

    const canvas = canvasRef.current;
    if (!canvas || chartData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 50, right: 50, bottom: 80, left: 100 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels (hours)
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px "DM Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
      const hours = (10 - i * 2);
      const y = padding.top + (i / 5) * chartHeight;
      ctx.fillText(`${hours}h`, padding.left - 15, y);
    }

    // Goal line
    const goalY = padding.top + chartHeight - (7.5 / 10) * chartHeight;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, goalY);
    ctx.lineTo(width - padding.right, goalY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#3b82f6';
    ctx.font = '11px "DM Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Goal: 7.5h', width - padding.right + 10, goalY);

    // Bars
    const barWidth = Math.max(chartWidth / chartData.length - 4, 8);
    chartData.forEach((d, i) => {
      const x = padding.left + (i / chartData.length) * chartWidth;
      const barHeight = (d.hours / 10) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      const isHovered = hoveredBar === i;

      // Bar
      ctx.fillStyle = isHovered ? qualityColors[d.quality] : qualityColors[d.quality] + 'CC';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Border
      if (isHovered) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);
      }
    });

    // X-axis labels (horizontal, bold)
    ctx.font = 'bold 12px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1e293b';
    const step = Math.ceil(chartData.length / 8);
    chartData.forEach((d, i) => {
      if (i % step === 0 || i === chartData.length - 1) {
        const x = padding.left + (i / chartData.length) * chartWidth + barWidth / 2;
        const dateObj = new Date(d.date);
        const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ctx.fillText(label, x, height - padding.bottom + 35);
      }
    });

    // Axis titles
    ctx.font = 'bold 14px "DM Sans", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    ctx.fillText('Date', width / 2, height - 15);

    ctx.save();
    ctx.translate(25, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Sleep Hours', 0, 0);
    ctx.restore();

    // Tooltip
    if (hoveredBar !== null) {
      const d = chartData[hoveredBar];
      const x = padding.left + (hoveredBar / chartData.length) * chartWidth;

      const tooltipWidth = 160;
      const tooltipHeight = 120;
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
      ctx.font = 'bold 14px "DM Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(d.date, tooltipX + 14, tooltipY + 24);

      ctx.font = '13px "DM Sans", sans-serif';
      ctx.fillStyle = qualityColors[d.quality];
      ctx.fillText(`${d.hours}h - ${d.quality}`, tooltipX + 14, tooltipY + 48);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px "DM Sans", sans-serif';
      ctx.fillText(`Deep: ${d.deepSleep}%`, tooltipX + 14, tooltipY + 70);
      ctx.fillText(`REM: ${d.remSleep}%`, tooltipX + 14, tooltipY + 88);
      ctx.fillText(`Interruptions: ${d.interruptions}`, tooltipX + 14, tooltipY + 106);
    }
  }, [chartData, hoveredBar, activeView]);

  useEffect(() => {
    if (activeView !== 'heatmap') return;

    const canvas = heatmapRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const cols = 7;
    const rows = Math.ceil(chartData.length / cols);
    const cellWidth = (width - 100) / cols;
    const cellHeight = (height - 60) / rows;
    const padding = 50;

    // Day labels
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    ctx.font = 'bold 12px "DM Sans", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    days.forEach((day, i) => {
      ctx.fillText(day, padding + i * cellWidth + cellWidth / 2, 30);
    });

    // Heatmap cells
    chartData.forEach((d, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padding + col * cellWidth;
      const y = padding + row * cellHeight;

      // Color based on quality
      ctx.fillStyle = qualityColors[d.quality] + '99';
      ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);

      // Hours text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.hours.toFixed(1), x + cellWidth / 2, y + cellHeight / 2);
    });
  }, [chartData, activeView]);

  const handleMouseMove = (e) => {
    if (activeView !== 'bars') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const barIndex = Math.floor((x - 100) / ((canvas.width - 150) / chartData.length));
    setHoveredBar(barIndex >= 0 && barIndex < chartData.length ? barIndex : null);
  };

  const handleMouseLeave = () => setHoveredBar(null);

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            <div className="mr-3 p-2 bg-blue-50 rounded-lg">
              <Moon className="h-5 w-5 text-blue-600" />
            </div>
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              {stats.trend === 'improving' && <TrendingUp className="h-3 w-3 mr-1" />}
              {stats.trend === 'declining' && <TrendingDown className="h-3 w-3 mr-1" />}
              {stats.avgHours}h avg
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
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveView('bars')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeView === 'bars'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setActiveView('heatmap')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeView === 'heatmap'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Calendar
          </button>
        </div>

        <div
          className="relative h-[340px] mb-6 bg-white rounded-lg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {activeView === 'bars' && (
            <canvas ref={canvasRef} width={900} height={340} className="w-full h-full" />
          )}
          {activeView === 'heatmap' && (
            <canvas ref={heatmapRef} width={700} height={340} className="w-full h-full" />
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {Object.entries(stats.qualityCounts).map(([quality, count]) => (
            <div key={quality} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">{quality}</span>
                <span className="text-xl font-bold text-gray-900">{count}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / chartData.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ backgroundColor: qualityColors[quality] }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          ))}
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
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sleep Debt</span>
                    <span className="font-semibold text-gray-900">{stats.sleepDebt}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consistency</span>
                    <span className="font-semibold text-gray-900">{stats.consistency}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal</span>
                    <span className="font-semibold text-gray-900">7.5h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trend</span>
                    <span className="font-semibold text-gray-900 capitalize">{stats.trend}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-3">Weekly Pattern</div>
                <div className="grid grid-cols-7 gap-2">
                  {stats.weeklyAvg.map(({ day, avg }) => (
                    <div key={day} className="text-center">
                      <div className="text-xs text-gray-600 mb-2">{day}</div>
                      <div className="h-16 bg-gray-100 rounded-lg flex items-end justify-center p-1">
                        <div
                          className="w-full rounded-sm"
                          style={{
                            height: `${(avg / 10) * 100}%`,
                            backgroundColor: '#3b82f6'
                          }}
                        />
                      </div>
                      <div className="text-xs font-semibold text-gray-900 mt-1">{avg.toFixed(1)}h</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-900 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {stats.avgHours >= 7.5
                    ? 'Great job! You\'re meeting your sleep goals consistently.'
                    : stats.avgHours >= 6.5
                    ? 'You\'re close to your goal. Try to get to bed 30 minutes earlier.'
                    : 'Consider prioritizing sleep. Aim for 7-8 hours per night.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SleepChart;