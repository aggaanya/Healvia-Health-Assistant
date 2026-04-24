import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const renderSharpText = (ctx, text, x, y, fontSize, color, align = 'left', bold = false) => {
  ctx.font = `${bold ? 'bold ' : ''}${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, Math.round(x), Math.round(y));
};

const MedicationChart = ({ data = [], title = "Medication Adherence" }) => {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const generateDefaultData = () => {
    const days = 30;
    const medications = ['Vitamin D', 'Omega-3', 'Multivitamin'];
    const result = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const taken = Math.random() > 0.2;
      
      result.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        taken,
        medication: medications[Math.floor(Math.random() * medications.length)],
        time: taken ? `${8 + Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` : null
      });
    }
    return result;
  };

  const chartData = data.length > 0 ? data : generateDefaultData();

  const calculateStats = () => {
    const totalDays = chartData.length;
    const takenCount = chartData.filter(d => d.taken).length;
    const adherenceRate = (takenCount / totalDays) * 100;

    return {
      totalDays,
      takenCount,
      missedCount: totalDays - takenCount,
      adherenceRate: Math.round(adherenceRate)
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
    const padding = { top: 60, right: 50, bottom: 70, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    // Timeline
    const timelineY = padding.top + chartHeight / 2;
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, timelineY);
    ctx.lineTo(width - padding.right, timelineY);
    ctx.stroke();

    // Legend
    renderSharpText(ctx, '✓ Taken', padding.left, padding.top - 30, 12, '#10b981', 'left', true);
    renderSharpText(ctx, '✗ Missed', padding.left + 80, padding.top - 30, 12, '#ef4444', 'left', true);

    // Dots
    const spacing = chartWidth / chartData.length;

    chartData.forEach((d, i) => {
      const x = padding.left + i * spacing;
      const isHovered = hoveredPoint === i;
      const y = d.taken ? timelineY - 50 : timelineY + 50;

      // Connection line
      ctx.strokeStyle = d.taken ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, timelineY);
      ctx.lineTo(x, y + (d.taken ? 10 : -10));
      ctx.stroke();

      // Dot
      const radius = isHovered ? 10 : 7;
      const color = d.taken ? '#10b981' : '#ef4444';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(Math.round(x), Math.round(y), radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Icon
      renderSharpText(ctx, d.taken ? '✓' : '✗', x, y, 10, '#ffffff', 'center', true);

      // Day labels
      if (i % 4 === 0 || isHovered) {
        renderSharpText(ctx, d.day, x, height - padding.bottom + 30, 13, isHovered ? '#1f2937' : '#6b7280', 'center', isHovered);
      }
    });

    // Axis label
    renderSharpText(ctx, 'Date', width / 2, height - 15, 14, '#6b7280', 'center', true);

    // Tooltip
    if (hoveredPoint !== null) {
      const d = chartData[hoveredPoint];
      const x = padding.left + hoveredPoint * spacing;
      const y = d.taken ? timelineY - 50 : timelineY + 50;

      const tooltipWidth = 180;
      const tooltipHeight = 100;
      const tooltipX = Math.min(width - tooltipWidth - 10, Math.max(10, x - tooltipWidth / 2));
      const tooltipY = d.taken ? y - tooltipHeight - 18 : y + 18;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 10);
      ctx.fill();

      ctx.shadowColor = 'transparent';

      const color = d.taken ? '#10b981' : '#ef4444';
      ctx.fillStyle = color;
      ctx.fillRect(tooltipX, tooltipY, 4, tooltipHeight);

      renderSharpText(ctx, d.date, tooltipX + 16, tooltipY + 22, 14, '#ffffff', 'left', true);
      renderSharpText(ctx, d.taken ? 'Taken' : 'Missed', tooltipX + 16, tooltipY + 45, 13, color, 'left', true);
      renderSharpText(ctx, `💊 ${d.medication}`, tooltipX + 16, tooltipY + 66, 12, '#9ca3af', 'left');
      
      if (d.taken && d.time) {
        renderSharpText(ctx, `🕐 ${d.time}`, tooltipX + 16, tooltipY + 84, 12, '#9ca3af', 'left');
      }
    }
  }, [chartData, hoveredPoint]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const spacing = (rect.width - 130) / chartData.length;
    const index = Math.round((x - 80) / spacing);
    setHoveredPoint(index >= 0 && index < chartData.length ? index : null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <Pill className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 ${
              stats.adherenceRate >= 90 ? 'bg-green-50 text-green-700 border-green-300' :
              stats.adherenceRate >= 70 ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
              'bg-red-50 text-red-700 border-red-300'
            }`}>
              {stats.adherenceRate}% adherence
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

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <div className="text-xs text-green-700 mb-2 font-bold uppercase tracking-wide flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Taken
            </div>
            <div className="text-2xl font-bold text-green-700">{stats.takenCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
            <div className="text-xs text-red-700 mb-2 font-bold uppercase tracking-wide flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Missed
            </div>
            <div className="text-2xl font-bold text-red-700">{stats.missedCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Success</div>
            <div className={`text-2xl font-bold ${
              stats.adherenceRate >= 90 ? 'text-green-600' :
              stats.adherenceRate >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>{stats.adherenceRate}%</div>
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
              <div className={`rounded-xl p-4 border-2 ${
                stats.adherenceRate >= 90 ? 'bg-green-50 border-green-300' :
                stats.adherenceRate >= 70 ? 'bg-yellow-50 border-yellow-300' :
                'bg-red-50 border-red-300'
              }`}>
                <p className={`text-sm font-medium ${
                  stats.adherenceRate >= 90 ? 'text-green-900' :
                  stats.adherenceRate >= 70 ? 'text-yellow-900' :
                  'text-red-900'
                }`}>
                  💊 {stats.adherenceRate >= 90
                    ? 'Excellent adherence! You\'re taking your medications consistently.' 
                    : stats.adherenceRate >= 70 
                    ? 'Good adherence. Try setting reminders to improve consistency.'
                    : 'Adherence needs attention. Consider using a pill organizer or phone reminders.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicationChart;