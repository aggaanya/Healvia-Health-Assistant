import { useState, useEffect } from "react";
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tabs from "./Tabs";
import { useHealthData } from "../../context/HealthDataContext";

const DaySidebar = ({ selectedDate, onClose, isOpen }) => {
  const { dailyEntries, saveDailyEntry } = useHealthData();
  const dateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  
  const [data, setData] = useState({
    mood: null,
    medications: '',
    sideEffects: '',
    symptoms: '',
    exercise: '',
    sleep: '',
    water: '',
    notes: ''
  });

  useEffect(() => {
    if (!selectedDate) return;
    
    const existingEntry = dailyEntries[dateKey];
    if (existingEntry) {
      setData(existingEntry);
    } else {
      setData({
        mood: null,
        medications: '',
        sideEffects: '',
        symptoms: '',
        exercise: '',
        sleep: '',
        water: '',
        notes: ''
      });
    }
  }, [selectedDate, dateKey, dailyEntries]);

  const handleSave = () => {
    if (dateKey) {
      saveDailyEntry(dateKey, data);
    }
    onClose();
  };

  const formatDate = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('default', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!selectedDate) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[420px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="h-full flex flex-col">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedDate.getDate()}</h2>
                    <p className="text-blue-100 text-sm mt-1">{formatDate()}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    type="button"
                    className="p-2 hover:bg-white/20 rounded-full transition"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </motion.div>

              <Tabs
                dailyData={data}
                setDailyData={setData}
                onSave={handleSave}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Floating Sidebar Toggle Button
export const SidebarToggle = ({ onClick }) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 z-30 md:hidden"
    >
      <Calendar size={28} />
    </motion.button>
  );
};

export default DaySidebar;