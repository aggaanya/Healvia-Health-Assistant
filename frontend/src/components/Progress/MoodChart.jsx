import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Badge } from '../Badge';
import { Smile, Meh, Frown, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Info } from 'lucide-react';

const MoodChart = ({ data = [], title = "Mood Analytics" }) => {
  const canvasRef = useRef(null);
  const radarRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeView, setActiveView] = useState('timeline');

  const generateDefaultData = () => {
    const moods = ['happy', 'neutral', 'sad'];
    const days = 30;
    const result = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      result.push({
        date: date.toISOString().split('T')[0],
        mood: moods[Math.floor(Math.random() * moods.length)],
        energy: 30 + Math.floor(Math.random() * 70),
        stress: 20 + Math.floor(Math.random() * 60),
        sleep: 5 + Math.random() * 4,
        social: 20 + Math.floor(Math.random() * 80)
      });
    }
    return result;
  };

  const chartData = data.length > 0 ? data : generateDefaultData();

  const calculateStats = () => {
    const moodCounts = chartData.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, { happy: 0, neutral: 0, sad: 0 });

    let longestStreak = 0;
    let tempStreak = 0;

    chartData.forEach((d) => {
      if (d.mood === 'happy') {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    const recentMoods = chartData.slice(-7);
    const recentHappy = recentMoods.filter(d => d.mood === 'happy').length;
    const trend = recentHappy >= 4 ? 'improving' : recentHappy <= 2 ? 'declining' : 'stable';

    const avgEnergy = chartData.reduce((sum, d) => sum + (d.energy || 0), 0) / chartData.length;
    const avgStress = chartData.reduce((sum, d) => sum + (d.stress || 0), 0) / chartData.length;
    const avgSleep = chartData.reduce((sum, d) => sum + (d.sleep || 0), 0) / chartData.length;

    return {
      moodCounts,
      longestStreak,
      trend,
      avgEnergy: Math.round(avgEnergy),
      avgStress: Math.round(avgStress),
      avgSleep: avgSleep.toFixed(1)
    };
  };

  const stats = calculateStats();

  const moodColors = {
    happy: '#3b82f6',
    neutral: '#94a3b8',
    sad: '#60a5fa',
  };

  useEffect(() => {
    if (activeView !== 'timeline') return;
    
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
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels 
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px "DM Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yLabels = ['Excellent', 'Good', 'Neutral', 'Fair', 'Poor'];
    yLabels.forEach((label, i) => {
      const y = padding.top + (i / 4) * chartHeight;
      ctx.fillText(label, padding.left - 15, y);
    });

    // X-axis labels 
    ctx.font = 'bold 12px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1e293b';
    const step = Math.ceil(chartData.length / 6);
    chartData.forEach((d, i) => {
      if (i % step === 0 || i === chartData.length - 1) {
        const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
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
    ctx.fillText('Mood Level', 0, 0);
    ctx.restore();

    // Map moods to values
    const moodMap = { sad: 0.2, neutral: 0.5, happy: 0.8 };
    const points = chartData.map((d, i) => {
      const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - (moodMap[d.mood] * chartHeight);
      return { x, y, ...d };
    });

    // Area fill
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    points.forEach((p, i) => {
      if (i === 0) {
        ctx.lineTo(p.x, p.y);
      } else {
        const prevPoint = points[i - 1];
        const cpX = (prevPoint.x + p.x) / 2;
        ctx.bezierCurveTo(cpX, prevPoint.y, cpX, p.y, p.x, p.y);
      }
    });
    ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        const prevPoint = points[i - 1];
        const cpX = (prevPoint.x + p.x) / 2;
        ctx.bezierCurveTo(cpX, prevPoint.y, cpX, p.y, p.x, p.y);
      }
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Points
    points.forEach((point, index) => {
      const isHovered = hoveredPoint === index;
      ctx.fillStyle = moodColors[point.mood];
      ctx.beginPath();
      ctx.arc(point.x, point.y, isHovered ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Tooltip
    if (hoveredPoint !== null) {
      const point = points[hoveredPoint];
      const tooltipWidth = 180;
      const tooltipHeight = 110;
      const tooltipX = Math.min(width - tooltipWidth - 10, Math.max(10, point.x - tooltipWidth / 2));
      const tooltipY = Math.max(10, point.y - tooltipHeight - 15);

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
      ctx.fillText(point.date, tooltipX + 14, tooltipY + 24);

      ctx.font = '13px "DM Sans", sans-serif';
      ctx.fillStyle = moodColors[point.mood];
      ctx.fillText(`Mood: ${point.mood}`, tooltipX + 14, tooltipY + 48);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px "DM Sans", sans-serif';
      ctx.fillText(`Energy: ${point.energy}%`, tooltipX + 14, tooltipY + 70);
      ctx.fillText(`Stress: ${point.stress}%`, tooltipX + 14, tooltipY + 90);
    }
  }, [chartData, hoveredPoint, activeView]);

  useEffect(() => {
    if (activeView !== 'radar') return;

    const canvas = radarRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 80;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const latestData = chartData.slice(-7);
    const radarMetrics = {
      'Energy': latestData.reduce((sum, d) => sum + (d.energy || 0), 0) / latestData.length,
      'Sleep': (latestData.reduce((sum, d) => sum + (d.sleep || 0), 0) / latestData.length) * 12.5,
      'Social': latestData.reduce((sum, d) => sum + (d.social || 0), 0) / latestData.length,
      'Mood': (latestData.filter(d => d.mood === 'happy').length / latestData.length) * 100,
      'Stress': 100 - (latestData.reduce((sum, d) => sum + (d.stress || 0), 0) / latestData.length)
    };

    const categories = Object.keys(radarMetrics);
    const values = Object.values(radarMetrics);

    // Grid circles
    for (let i = 1; i <= 5; i++) {
      const radius = (i / 5) * maxRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axes
    categories.forEach((_, i) => {
      const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius);
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();
    });

    // Data polygon
    ctx.beginPath();
    values.forEach((value, i) => {
      const angle = (i / values.length) * Math.PI * 2 - Math.PI / 2;
      const radius = (value / 100) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points
    values.forEach((value, i) => {
      const angle = (i / values.length) * Math.PI * 2 - Math.PI / 2;
      const radius = (value / 100) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    categories.forEach((label, i) => {
      const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
      const labelRadius = maxRadius + 35;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;

      ctx.fillText(label, x, y);
      ctx.font = '12px "DM Sans", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`${Math.round(radarMetrics[label])}`, x, y + 18);
      ctx.font = 'bold 13px "DM Sans", sans-serif';
      ctx.fillStyle = '#1e293b';
    });
  }, [chartData, activeView]);

  const handleMouseMove = (e) => {
    if (activeView !== 'timeline') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pointIndex = Math.round((x - 100) / ((canvas.width - 150) / (chartData.length - 1)));
    setHoveredPoint(Math.min(Math.max(pointIndex, 0), chartData.length - 1));
  };

  const handleMouseLeave = () => setHoveredPoint(null);

  const getMoodIcon = (mood) => {
    const icons = { happy: Smile, neutral: Meh, sad: Frown };
    const Icon = icons[mood];
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            <div className="mr-3 p-2 bg-blue-50 rounded-lg">
              <Smile className="h-5 w-5 text-blue-600" />
            </div>
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              {stats.trend === 'improving' && <TrendingUp className="h-3 w-3 mr-1" />}
              {stats.trend === 'declining' && <TrendingDown className="h-3 w-3 mr-1" />}
              {stats.trend}
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
            onClick={() => setActiveView('timeline')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeView === 'timeline'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveView('radar')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeView === 'radar'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Radar View
          </button>
        </div>

        <div
          className="relative h-[340px] mb-6 bg-white rounded-lg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {activeView === 'timeline' && (
            <canvas ref={canvasRef} width={900} height={340} className="w-full h-full" />
          )}
          {activeView === 'radar' && (
            <canvas ref={radarRef} width={600} height={340} className="w-full h-full" />
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {Object.entries(stats.moodCounts).map(([mood, count]) => (
            <div key={mood} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getMoodIcon(mood)}
                  <span className="text-sm font-semibold text-gray-700 capitalize">{mood}</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{count}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / chartData.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ backgroundColor: moodColors[mood] }}
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
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longest Streak</span>
                    <span className="font-semibold text-gray-900">{stats.longestStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Energy</span>
                    <span className="font-semibold text-gray-900">{stats.avgEnergy}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Sleep</span>
                    <span className="font-semibold text-gray-900">{stats.avgSleep}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Mood %</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round((stats.moodCounts.happy / chartData.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-900 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {stats.trend === 'improving' && 'Your mood has been improving! Keep up the positive habits.'}
                  {stats.trend === 'declining' && 'Consider activities that boost your mood, like exercise or socializing.'}
                  {stats.trend === 'stable' && 'Your mood is stable. Maintain your current routine for consistency.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default MoodChart;