import { useState } from 'react';
import CalendarHeader from '../components/Calendar/CalendarHeader';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import DaySidebar, { SidebarToggle } from '../components/Calendar/DaySidebar';
import { motion } from 'framer-motion';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setSelectedDate(null), 300);
  };

  const handleToggleSidebar = () => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <CalendarHeader
            monthDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <CalendarGrid
            currentDate={currentDate}
            onSelectDate={handleSelectDate}
          />
        </motion.div>
      </div>

      <DaySidebar
        selectedDate={selectedDate}
        onClose={handleCloseSidebar}
        isOpen={isSidebarOpen}
      />

      <SidebarToggle 
        onClick={handleToggleSidebar} 
        isOpen={isSidebarOpen}
      />
    </motion.div>
  );
};

export default Calendar;