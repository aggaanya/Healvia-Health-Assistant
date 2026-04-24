import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Target, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const renderSharpText = (ctx, text, x, y, fontSize, color, align = 'left', bold = false) => {
  ctx.font = `${bold ? 'bold ' : ''}${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, Math.round(x), Math.round(y));
};

const ExerciseChart = ({ data = [], title = "Exercise Analytics" }) => {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const generateDefaultData = () => {
    const days = 30;
    const result = [];
    const types = ['Cardio', 'Strength', 'Yoga', 'Sports', 'Walking'];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const minutes = Math.floor(Math.random() * 90) + 10;
      const goal = 45;
      
      result.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes,
        goal,
        type: types[Math.floor(Math.random() * types.length)],
        calories: Math.floor(minutes * (3 + Math.random() * 5)),
      });
    }
    return result;
  };

  const chartData = data.length > 0 ? data : generateDefaultData();

  const calculateStats = () => {
    const totalMinutes = chartData.reduce((sum, d) => sum + d.minutes, 0);
    const avgMinutes = totalMinutes / chartData.length;
    const goalsHit = chartData.filter(d => d.minutes >= d.goal).length;
    const goalPercentage = (goalsHit / chartData.length) * 100;
    const totalCalories = chartData.reduce((sum, d) => sum + (d.calories || 0), 0);

    return {
      totalMinutes,
      avgMinutes: Math.round(avgMinutes),
      totalCalories,
      goalsHit,
      goalPercentage: Math.round(goalPercentage)
    };
  };

  const stats = calculateStats();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || chartData.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 50, right: 50, bottom: 70, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels
    const maxMinutes = Math.max(...chartData.map(d => Math.max(d.minutes, d.goal))) * 1.1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      const minutes = Math.round(maxMinutes - (i / 5) * maxMinutes);
      renderSharpText(ctx, `${minutes}`, padding.left - 20, y, 14, '#374151', 'right', true);
    }

    // Goal line
    const goalY = padding.top + chartHeight - ((45 / maxMinutes) * chartHeight);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, goalY);
    ctx.lineTo(width - padding.right, goalY);
    ctx.stroke();
    ctx.setLineDash([]);
    renderSharpText(ctx, 'GOAL', width - padding.right + 10, goalY, 12, '#10b981', 'left', true);

    // Bars
    const barWidth = chartWidth / chartData.length;
    const barPadding = barWidth * 0.2;

    chartData.forEach((d, i) => {
      const x = padding.left + i * barWidth;
      const barHeight = (d.minutes / maxMinutes) * chartHeight;
      const y = padding.top + chartHeight - barHeight;
      const isHovered = hoveredPoint === i;

      const color = d.minutes >= d.goal ? '#10b981' : d.minutes >= d.goal * 0.7 ? '#eab308' : '#ef4444';

      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x + barPadding), Math.round(y), Math.round(barWidth - barPadding * 2), Math.round(barHeight));

      if (isHovered) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(Math.round(x + barPadding - 1), Math.round(y - 1), Math.round(barWidth - barPadding * 2 + 2), Math.round(barHeight + 2));
      }

      if (d.minutes >= d.goal) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(Math.round(x + barWidth / 2), Math.round(y - 12), isHovered ? 6 : 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (i % 4 === 0 || isHovered) {
        renderSharpText(ctx, d.day, x + barWidth / 2, height - padding.bottom + 30, 13, isHovered ? '#1f2937' : '#6b7280', 'center', isHovered);
      }
    });

    // Axis labels
    renderSharpText(ctx, 'Date', width / 2, height - 15, 14, '#6b7280', 'center', true);
    ctx.save();
    ctx.translate(25, height / 2);
    ctx.rotate(-Math.PI / 2);
    renderSharpText(ctx, 'Minutes', 0, 0, 14, '#6b7280', 'center', true);
    ctx.restore();

    // Tooltip
    if (hoveredPoint !== null) {
      const d = chartData[hoveredPoint];
      const x = padding.left + hoveredPoint * barWidth;
      const barHeight = (d.minutes / maxMinutes) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      const tooltipWidth = 190;
      const tooltipHeight = 120;
      const tooltipX = Math.min(width - tooltipWidth - 10, Math.max(10, x + barWidth / 2 - tooltipWidth / 2));
      const tooltipY = Math.max(10, y - tooltipHeight - 18);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 10);
      ctx.fill();

      ctx.shadowColor = 'transparent';

      const color = d.minutes >= d.goal ? '#10b981' : d.minutes >= d.goal * 0.7 ? '#eab308' : '#ef4444';
      ctx.fillStyle = color;
      ctx.fillRect(tooltipX, tooltipY, 4, tooltipHeight);

      renderSharpText(ctx, d.date, tooltipX + 16, tooltipY + 22, 14, '#ffffff', 'left', true);
      renderSharpText(ctx, `${d.minutes} minutes`, tooltipX + 16, tooltipY + 45, 13, color, 'left', true);
      renderSharpText(ctx, `Type: ${d.type}`, tooltipX + 16, tooltipY + 66, 12, '#9ca3af', 'left');
      renderSharpText(ctx, `🔥 ${d.calories} calories`, tooltipX + 16, tooltipY + 85, 12, '#9ca3af', 'left');

      if (d.minutes >= d.goal) {
        renderSharpText(ctx, `✓ Goal (+${d.minutes - d.goal}m)`, tooltipX + 16, tooltipY + 105, 12, '#10b981', 'left', true);
      } else {
        renderSharpText(ctx, `✗ ${d.goal - d.minutes}m short`, tooltipX + 16, tooltipY + 105, 12, '#ef4444', 'left', true);
      }
    }
  }, [chartData, hoveredPoint]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const barWidth = (rect.width - 130) / chartData.length;
    const index = Math.floor((x - 80) / barWidth);
    setHoveredPoint(index >= 0 && index < chartData.length ? index : null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 ${
              stats.goalPercentage >= 80 ? 'bg-green-50 text-green-700 border-green-300' :
              stats.goalPercentage >= 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
              'bg-red-50 text-red-700 border-red-300'
            }`}>
              {stats.goalPercentage}% goals
            </span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {showDetails ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div
          className="relative h-[420px] mb-6"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: 'crisp-edges' }} />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Total Time</div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(stats.totalMinutes / 60)}h</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Daily Avg</div>
            <div className="text-2xl font-bold text-gray-900">{stats.avgMinutes}m</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <div className="text-xs text-green-700 mb-2 font-bold uppercase tracking-wide flex items-center gap-1">
              <Target className="h-3 w-3" />
              Goals Hit
            </div>
            <div className="text-2xl font-bold text-green-700">{stats.goalsHit}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Calories</div>
            <div className="text-2xl font-bold text-orange-600">{stats.totalCalories}</div>
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-6 pt-6 border-t border-gray-200"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900 font-medium">
                  💡 {stats.goalPercentage >= 80 
                    ? 'Excellent work! You\'re consistently hitting your exercise goals.' 
                    : stats.goalPercentage >= 60 
                    ? 'Good progress! Try to increase consistency to reach your goals more often.'
                    : 'Focus on building a consistent routine. Even 15 minutes daily makes a difference.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExerciseChart;