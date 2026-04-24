import { useState, useEffect, createContext, useContext } from "react";

const HealthDataContext = createContext();

export const HealthDataProvider = ({ children }) => {
  const [dailyEntries, setDailyEntries] = useState({});
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const entriesResult = await window.storage.get('health-daily-entries');
        const medsResult = await window.storage.get('health-medications');
        
        if (entriesResult) {
          setDailyEntries(JSON.parse(entriesResult.value));
        }
        if (medsResult) {
          setMedications(JSON.parse(medsResult.value));
        }
      } catch (error) {
        console.log('No saved data found or error loading:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const saveDailyEntry = async (date, data) => {
    const updatedEntries = {
      ...dailyEntries,
      [date]: data
    };
    setDailyEntries(updatedEntries);
    
    try {
      await window.storage.set('health-daily-entries', JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const addMedication = async (medication) => {
    const updatedMeds = [...medications, { ...medication, id: Date.now() }];
    setMedications(updatedMeds);
    
    try {
      await window.storage.set('health-medications', JSON.stringify(updatedMeds));
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  const deleteMedication = async (id) => {
    const updatedMeds = medications.filter(med => med.id !== id);
    setMedications(updatedMeds);
    
    try {
      await window.storage.set('health-medications', JSON.stringify(updatedMeds));
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <div className="text-blue-500 text-xl font-semibold">Loading your health data...</div>
      </div>
    );
  }

  return (
    <HealthDataContext.Provider
      value={{
        dailyEntries,
        saveDailyEntry,
        medications,
        setMedications,
        addMedication,
        deleteMedication
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const ctx = useContext(HealthDataContext);
  if (!ctx) throw new Error("useHealthData must be used inside HealthDataProvider");
  return ctx;
};

export default HealthDataContext;