import { motion } from 'framer-motion';
import { useHealthData } from "../../context/HealthDataContext";

const DayCell = ({ date, onClick }) => {
  const { dailyEntries, medications } = useHealthData();
  const dateKey = date.toISOString().split("T")[0];
  const isMarked = dailyEntries[dateKey];
  
  const hasMedication = medications.some(med => {
    const dayOfWeek = date.getDay();
    if (!med.daysOfWeek.includes(dayOfWeek)) return false;
    
    if (med.isContinuous) return true;
    
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    
    if (med.startDate) {
      const startDate = new Date(med.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      if (med.endDate) {
        const endDate = new Date(med.endDate);
        endDate.setHours(0, 0, 0, 0);
        return currentDate >= startDate && currentDate <= endDate;
      }
      
      if (med.numberOfDays) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + parseInt(med.numberOfDays) - 1);
        return currentDate >= startDate && currentDate <= endDate;
      }
      
      return currentDate >= startDate;
    }
    
    return false;
  });
  
  const isToday = () => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isPastDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  return (
    <div className="flex justify-center items-center">
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(date)}
        type="button"
        className={`
          w-14 h-14 rounded-full flex items-center justify-center text-base md:text-lg
          font-medium transition-all duration-200 relative
          ${isToday() 
            ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50 text-blue-600 font-bold' 
            : ''
          }
          ${isMarked 
            ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md hover:shadow-lg' 
            : isPastDate()
              ? 'text-gray-400 hover:bg-gray-100'
              : 'text-gray-700 hover:bg-blue-50'
          }
        `}
      >
        {date.getDate()}
        {hasMedication && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>
    </div>
  );
};

export default DayCell;