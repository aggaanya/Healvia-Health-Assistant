import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Target, ChevronDown, ChevronUp } from 'lucide-react';

const renderSharpText = (ctx, text, x, y, fontSize, color, align = 'left', bold = false) => {
  ctx.font = `${bold ? 'bold ' : ''}${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, Math.round(x), Math.round(y));
};

const WaterChart = ({ data = [], title = "Hydration Tracker" }) => {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const generateDefaultData = () => {
    const days = 30;
    const result = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const cups = Math.floor(Math.random() * 6) + 4;
      const goal = 8;
      
      result.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        cups,
        goal,
        ml: cups * 250
      });
    }
    return result;
  };

  const chartData = data.length > 0 ? data : generateDefaultData();

  const calculateStats = () => {
    const totalCups = chartData.reduce((sum, d) => sum + d.cups, 0);
    const avgCups = totalCups / chartData.length;
    const goalsHit = chartData.filter(d => d.cups >= d.goal).length;
    const goalPercentage = (goalsHit / chartData.length) * 100;

    return {
      totalCups,
      totalLiters: ((totalCups * 250) / 1000).toFixed(1),
      avgCups: avgCups.toFixed(1),
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
    const maxCups = 12;
    for (let i = 0; i <= 6; i++) {
      const y = padding.top + (i / 6) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const cups = maxCups - (i / 6) * maxCups;
      renderSharpText(ctx, `${Math.round(cups)}`, padding.left - 20, y, 14, '#374151', 'right', true);
    }

    // Goal line
    const goalY = padding.top + chartHeight - ((8 / maxCups) * chartHeight);
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
      const barHeight = (d.cups / maxCups) * chartHeight;
      const y = padding.top + chartHeight - barHeight;
      const isHovered = hoveredPoint === i;

      const color = d.cups >= d.goal ? '#10b981' : d.cups >= d.goal * 0.7 ? '#eab308' : '#ef4444';

      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x + barPadding), Math.round(y), Math.round(barWidth - barPadding * 2), Math.round(barHeight));

      if (isHovered) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(Math.round(x + barPadding - 1), Math.round(y - 1), Math.round(barWidth - barPadding * 2 + 2), Math.round(barHeight + 2));
      }

      if (d.cups >= d.goal) {
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
    renderSharpText(ctx, 'Cups', 0, 0, 14, '#6b7280', 'center', true);
    ctx.restore();

    // Tooltip
    if (hoveredPoint !== null) {
      const d = chartData[hoveredPoint];
      const x = padding.left + hoveredPoint * barWidth;
      const barHeight = (d.cups / maxCups) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      const tooltipWidth = 180;
      const tooltipHeight = 110;
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

      const color = d.cups >= d.goal ? '#10b981' : d.cups >= d.goal * 0.7 ? '#eab308' : '#ef4444';
      ctx.fillStyle = color;
      ctx.fillRect(tooltipX, tooltipY, 4, tooltipHeight);

      renderSharpText(ctx, d.date, tooltipX + 16, tooltipY + 22, 14, '#ffffff', 'left', true);
      renderSharpText(ctx, `${d.cups} cups`, tooltipX + 16, tooltipY + 45, 13, color, 'left', true);
      renderSharpText(ctx, `${d.ml}ml`, tooltipX + 16, tooltipY + 66, 12, '#9ca3af', 'left');

      if (d.cups >= d.goal) {
        renderSharpText(ctx, `✓ Goal (+${d.cups - d.goal})`, tooltipX + 16, tooltipY + 90, 12, '#10b981', 'left', true);
      } else {
        renderSharpText(ctx, `✗ ${d.goal - d.cups} cups short`, tooltipX + 16, tooltipY + 90, 12, '#ef4444', 'left', true);
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
            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <Droplets className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 ${
              stats.goalPercentage >= 80 ? 'bg-green-50 text-green-700 border-green-300' :
              stats.goalPercentage >= 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
              'bg-red-50 text-red-700 border-red-300'
            }`}>
              {stats.avgCups} cups avg
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
            <div className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalLiters}L</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Daily Avg</div>
            <div className="text-2xl font-bold text-gray-900">{stats.avgCups}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <div className="text-xs text-green-700 mb-2 font-bold uppercase tracking-wide flex items-center gap-1">
              <Target className="h-3 w-3" />
              Goals Hit
            </div>
            <div className="text-2xl font-bold text-green-700">{stats.goalsHit}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Success</div>
            <div className={`text-2xl font-bold ${
              stats.goalPercentage >= 80 ? 'text-green-600' :
              stats.goalPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>{stats.goalPercentage}%</div>
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
                  💧 {parseFloat(stats.avgCups) >= 8
                    ? 'Excellent hydration! You\'re meeting your daily water goal consistently.' 
                    : parseFloat(stats.avgCups) >= 6 
                    ? 'Good progress! Try to drink 1-2 more cups daily to reach optimal hydration.'
                    : 'Focus on increasing your water intake. Set reminders throughout the day.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WaterChart;