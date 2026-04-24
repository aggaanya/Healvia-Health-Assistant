import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'weekly', label: 'Weekly', icon: TrendingUp },
    { id: 'monthly', label: 'Monthly', icon: BarChart3 },
    { id: 'yearly', label: 'Yearly', icon: Calendar }
  ];

  return (
    <div className="relative">
      <div className="relative bg-white rounded-xl p-2 border border-gray-200 shadow-sm">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 group"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-lg shadow-sm"
                    transition={{ type: 'tween', duration: 0.2 }}
                  />
                )}

                <div className={`relative px-6 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold text-sm" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      {tab.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
};

export default TabNavigation;