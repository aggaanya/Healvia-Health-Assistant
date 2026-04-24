import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabNavigation from '../components/Progress/TabNavigation';
import WeeklyTab from '../components/Progress/WeeklyTab';
import MonthlyTab from '../components/Progress/MonthlyTab';
import YearlyTab from '../components/Progress/YearlyTab';
import { Card } from '../components/Card';
import { Activity, Download, Share2, Settings } from 'lucide-react';

const Progress = () => {
  const [activeTab, setActiveTab] = useState('weekly');

  const sampleData = {
    weekly: {
      summary: null,
      mood: [],
      sleep: [],
      exercise: [],
      water: [],
      medication: [],
      streaks: [],
      tips: []
    },
    monthly: {
      summary: null,
      mood: [],
      sleep: [],
      exercise: [],
      water: [],
      medication: [],
      streaks: [],
      tips: [],
      monthlySummary: null
    },
    yearly: {
      summary: null,
      mood: [],
      sleep: [],
      exercise: [],
      water: [],
      medication: [],
      streaks: [],
      tips: [],
      yearlySummary: null
    }
  };

  const renderTabContent = () => {
    const tabComponents = {
      weekly: <WeeklyTab data={sampleData.weekly} />,
      monthly: <MonthlyTab data={sampleData.monthly} />,
      yearly: <YearlyTab data={sampleData.yearly} />
    };

    return tabComponents[activeTab];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-xl shadow-sm">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  Health Progress
                </h1>
              </div>
              <p className="text-gray-600 ml-14">
                Track your wellness journey with comprehensive analytics
              </p>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors shadow-sm"
              >
                <Download className="h-5 w-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors shadow-sm"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors shadow-sm"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Card className="inline-block bg-white border border-gray-200">
            <div className="px-6 py-3">
              <p className="text-xs text-gray-600">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;