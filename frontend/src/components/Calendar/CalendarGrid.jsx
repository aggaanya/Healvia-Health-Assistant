import { motion } from 'framer-motion';
import { useHealthData } from "../../context/HealthDataContext";
import { Stethoscope } from 'lucide-react';

const CalendarGrid = ({ currentDate, onSelectDate }) => {
  const { dailyEntries } = useHealthData();
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const hasEntry = (day) => {
    const dateKey = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    return dailyEntries[dateKey] && Object.keys(dailyEntries[dateKey]).length > 0;
  };

  const hasAppointment = (day) => {
    const dateKey = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    return dailyEntries[dateKey]?.doctorAppointment?.hasAppointment;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center font-bold text-gray-600 text-sm md:text-base py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <motion.button
            key={index}
            whileHover={day ? { scale: 1.05 } : {}}
            whileTap={day ? { scale: 0.95 } : {}}
            onClick={() => day && onSelectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
            className={`
              aspect-square p-2 rounded-xl text-center font-semibold transition relative
              ${!day ? 'invisible' : ''}
              ${isToday(day) 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-2 ring-blue-300' 
                : hasEntry(day)
                ? 'bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800 hover:shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }
            `}
            disabled={!day}
          >
            {day && (
              <>
                <span className="text-sm md:text-base">{day}</span>
                {hasEntry(day) && !isToday(day) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  </div>
                )}
                {hasAppointment(day) && (
                  <div className="absolute top-1 right-1">
                    <Stethoscope size={12} className={isToday(day) ? 'text-white' : 'text-blue-600'} />
                  </div>
                )}
              </>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;