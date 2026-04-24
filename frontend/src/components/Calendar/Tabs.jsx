import React from 'react';
import { useState } from 'react';
import { useHealthData } from "../../context/HealthDataContext";
import MoodSelector from './MoodSelector';
import { ChevronRight, Calendar, Clock, MapPin, Stethoscope } from 'lucide-react';

const Tabs = ({ dailyData, setDailyData, onSave, onClose }) => {
  const { medications, addMedication, deleteMedication } = useHealthData();
  const [tab, setTab] = useState("daily");
  const [medForm, setMedForm] = useState({
    name: '',
    daysOfWeek: [],
    isContinuous: false,
    startDate: '',
    endDate: '',
    numberOfDays: ''
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day) => {
    setMedForm(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const handleAddMedication = () => {
    if (!medForm.name || medForm.daysOfWeek.length === 0) {
      alert('Please enter medication name and select at least one day');
      return;
    }

    if (!medForm.isContinuous && !medForm.startDate) {
      alert('Please select a start date');
      return;
    }

    addMedication(medForm);
    setMedForm({
      name: '',
      daysOfWeek: [],
      isContinuous: false,
      startDate: '',
      endDate: '',
      numberOfDays: ''
    });
  };

  return (
    <>
      <div className="flex gap-2 p-4 border-b border-gray-200">
        <button 
          onClick={() => setTab("daily")}
          type="button"
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
            tab === "daily" 
              ? "bg-blue-700 text-white shadow-md hover:bg-blue-800" 
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          Daily Tracker
        </button>
        <button 
          onClick={() => setTab("reminder")}
          type="button"
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
            tab === "reminder" 
              ? "bg-blue-700 text-white shadow-md hover:bg-blue-800" 
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          Reminder
        </button>
      </div>

      {tab === "daily" && (
        <div className="flex-1 p-6 space-y-6 bg-gradient-to-b from-blue-50/30 to-white overflow-y-auto">
          <MoodSelector 
            value={dailyData.mood}
            onChange={(mood) => setDailyData({ ...dailyData, mood })}
          />

          {/* Doctor's Appointment Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 shadow-md">
            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={dailyData.doctorAppointment?.hasAppointment || false}
                onChange={(e) => setDailyData({ 
                  ...dailyData, 
                  doctorAppointment: {
                    ...dailyData.doctorAppointment,
                    hasAppointment: e.target.checked
                  }
                })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <Stethoscope size={20} className="text-blue-600" />
                <span className="text-lg font-bold text-gray-800">Doctor's Appointment</span>
              </div>
            </label>

            {dailyData.doctorAppointment?.hasAppointment && (
              <div className="space-y-4 mt-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Stethoscope size={16} />
                    Doctor's Name
                  </label>
                  <input
                    type="text"
                    value={dailyData.doctorAppointment?.doctorName || ''}
                    onChange={(e) => setDailyData({ 
                      ...dailyData, 
                      doctorAppointment: {
                        ...dailyData.doctorAppointment,
                        doctorName: e.target.value
                      }
                    })}
                    className="w-full p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    placeholder="Dr. Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Appointment Time
                  </label>
                  <input
                    type="time"
                    value={dailyData.doctorAppointment?.time || ''}
                    onChange={(e) => setDailyData({ 
                      ...dailyData, 
                      doctorAppointment: {
                        ...dailyData.doctorAppointment,
                        time: e.target.value
                      }
                    })}
                    className="w-full p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    Location/Clinic
                  </label>
                  <input
                    type="text"
                    value={dailyData.doctorAppointment?.location || ''}
                    onChange={(e) => setDailyData({ 
                      ...dailyData, 
                      doctorAppointment: {
                        ...dailyData.doctorAppointment,
                        location: e.target.value
                      }
                    })}
                    className="w-full p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    placeholder="City Hospital, Main Street Clinic..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Reason for Visit
                  </label>
                  <textarea
                    value={dailyData.doctorAppointment?.reason || ''}
                    onChange={(e) => setDailyData({ 
                      ...dailyData, 
                      doctorAppointment: {
                        ...dailyData.doctorAppointment,
                        reason: e.target.value
                      }
                    })}
                    className="w-full p-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    rows={2}
                    placeholder="Annual checkup, follow-up visit, specific concern..."
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Medications Taken
            </label>
            <textarea
              value={dailyData.medications || ''}
              onChange={(e) => setDailyData({ ...dailyData, medications: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows={2}
              placeholder="e.g., Aspirin 100mg, Vitamin D 1000 IU"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Side Effects
            </label>
            <textarea
              value={dailyData.sideEffects || ''}
              onChange={(e) => setDailyData({ ...dailyData, sideEffects: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows={2}
              placeholder="Any side effects experienced..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Symptoms
            </label>
            <textarea
              value={dailyData.symptoms || ''}
              onChange={(e) => setDailyData({ ...dailyData, symptoms: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows={2}
              placeholder="Headache, fatigue, nausea..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Exercise
            </label>
            <input
              type="text"
              value={dailyData.exercise || ''}
              onChange={(e) => setDailyData({ ...dailyData, exercise: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="30 min walk, yoga, strength training..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Sleep Duration
            </label>
            <input
              type="text"
              value={dailyData.sleep || ''}
              onChange={(e) => setDailyData({ ...dailyData, sleep: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="8 hours, 7.5 hours..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Water Intake
            </label>
            <input
              type="text"
              value={dailyData.water || ''}
              onChange={(e) => setDailyData({ ...dailyData, water: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="8 glasses, 2 liters..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={dailyData.notes || ''}
              onChange={(e) => setDailyData({ ...dailyData, notes: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows={3}
              placeholder="Any other observations, feelings, or notes..."
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={onSave}
              type="button"
              className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-md"
            >
              Save Entry
              <ChevronRight size={20} />
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-full bg-blue-100 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {tab === "reminder" && (
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Medication Name
            </label>
            <input
              type="text"
              value={medForm.name}
              onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g., Aspirin, Vitamin D"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Days of Week
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day, idx) => (
                <button
                  key={day}
                  onClick={() => toggleDay(idx)}
                  type="button"
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    medForm.daysOfWeek.includes(idx)
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={medForm.isContinuous}
                onChange={(e) => setMedForm({ ...medForm, isContinuous: e.target.checked })}
                className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-bold text-gray-700">Continuous/Indefinite</span>
            </label>

            {!medForm.isContinuous && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={medForm.startDate}
                    onChange={(e) => setMedForm({ ...medForm, startDate: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={medForm.endDate}
                    onChange={(e) => setMedForm({ ...medForm, endDate: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div className="text-center text-gray-500 font-semibold">OR</div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    value={medForm.numberOfDays}
                    onChange={(e) => setMedForm({ ...medForm, numberOfDays: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g., 30"
                    min="1"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAddMedication}
            type="button"
            className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-md"
          >
            Add Medication
            <ChevronRight size={20} />
          </button>

          {medications.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3">Active Medications</h3>
              <div className="space-y-3">
                {medications.map((med) => (
                  <div key={med.id} className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">{med.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {med.daysOfWeek.map(d => daysOfWeek[d]).join(', ')}
                        </p>
                        {med.isContinuous ? (
                          <p className="text-xs text-blue-600 mt-1">Continuous</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">
                            {med.startDate && `From: ${med.startDate}`}
                            {med.endDate && ` To: ${med.endDate}`}
                            {med.numberOfDays && ` (${med.numberOfDays} days)`}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteMedication(med.id)}
                        type="button"
                        className="text-red-500 hover:text-red-700 font-bold text-2xl leading-none"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Tabs;