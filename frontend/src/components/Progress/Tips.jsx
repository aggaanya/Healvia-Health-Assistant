import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Badge } from '../Badge';
import { Lightbulb, Sparkles, Target, Heart, Brain, Droplets, Moon, Activity } from 'lucide-react';

const Tips = ({ tips = [], category = 'general' }) => {
  const defaultTips = [
    {
      type: 'positive',
      category: 'sleep',
      icon: Moon,
      title: 'Excellent Sleep Pattern!',
      message: 'Your consistent 7-8 hours of sleep is contributing to better mood and energy levels.',
      priority: 'low'
    },
    {
      type: 'suggestion',
      category: 'exercise',
      icon: Activity,
      title: 'Boost Your Activity',
      message: 'Try adding 10 more minutes of exercise to reach your optimal fitness zone.',
      priority: 'medium',
      action: 'Set a reminder'
    },
    {
      type: 'warning',
      category: 'hydration',
      icon: Droplets,
      title: 'Hydration Alert',
      message: 'You\'ve been drinking less water on weekends. Aim for 8 cups daily.',
      priority: 'high',
      action: 'Track water intake'
    },
    {
      type: 'insight',
      category: 'mood',
      icon: Brain,
      title: 'Mood-Exercise Connection',
      message: 'Data shows your mood improves significantly on days you exercise.',
      priority: 'low'
    }
  ];

  const tipData = tips.length > 0 ? tips : defaultTips;

  const getTipStyles = (type) => {
    const styles = {
      positive: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
        text: 'text-blue-900'
      },
      suggestion: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'bg-gray-100 text-gray-600',
        badge: 'bg-gray-100 text-gray-800 border-gray-200',
        text: 'text-gray-900'
      },
      warning: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
        text: 'text-blue-900'
      },
      insight: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'bg-gray-100 text-gray-600',
        badge: 'bg-gray-100 text-gray-800 border-gray-200',
        text: 'text-gray-900'
      }
    };
    return styles[type] || styles.suggestion;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { label: 'High Priority', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      medium: { label: 'Medium', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      low: { label: 'Info', color: 'bg-gray-100 text-gray-600 border-gray-200' }
    };
    return badges[priority] || badges.low;
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            <div className="mr-3 p-2 bg-blue-50 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            Personalized Health Tips
          </CardTitle>
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-3">
        {tipData.map((tip, idx) => {
          const styles = getTipStyles(tip.type);
          const priorityBadge = getPriorityBadge(tip.priority);
          const TipIcon = tip.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className={`relative overflow-hidden rounded-lg border ${styles.border} ${styles.bg}`}
            >
              {tip.priority === 'high' && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
              )}

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${styles.icon}`}>
                    <TipIcon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-gray-900">{tip.title}</h4>
                      <Badge className={`${priorityBadge.color} border text-xs flex-shrink-0 font-medium`}>
                        {priorityBadge.label}
                      </Badge>
                    </div>

                    <p className={`text-xs leading-relaxed ${styles.text} mb-3`}>
                      {tip.message}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${styles.badge} border font-medium`}>
                        {tip.category}
                      </span>

                      {tip.action && (
                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                          {tip.action} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: tipData.length * 0.05, duration: 0.3 }}
          className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Your Focus Areas</h4>
              <p className="text-xs text-gray-600">
                {tipData.filter(t => t.priority === 'high').length > 0
                  ? `${tipData.filter(t => t.priority === 'high').length} high-priority action${tipData.filter(t => t.priority === 'high').length > 1 ? 's' : ''} recommended`
                  : 'You\'re doing great! Keep maintaining your healthy habits.'}
              </p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200 font-medium">
              {tipData.length} tips
            </Badge>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default Tips;