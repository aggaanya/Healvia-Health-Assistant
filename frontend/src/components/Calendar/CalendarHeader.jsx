import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CalendarHeader = ({ monthDate, onPrevMonth, onNextMonth }) => {
  const monthName = monthDate.toLocaleDateString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="flex items-center justify-between mb-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPrevMonth}
        className="bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center gap-2 shadow-md"
      >
        <ChevronLeft size={20} />
        Previous
      </motion.button>
      
      <motion.h2 
        key={monthName}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-gray-800"
      >
        {monthName}
      </motion.h2>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNextMonth}
        className="bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center gap-2 shadow-md"
      >
        Next
        <ChevronRight size={20} />
      </motion.button>
    </div>
  );
};

export default CalendarHeader;