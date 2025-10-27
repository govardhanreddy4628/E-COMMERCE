import React, { useContext, useState } from "react";
import { CalendarContext } from "./calendarContext";

interface AddEventModalProps {
  date: Date;
  onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ date, onClose }) => {
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("09:00");
    
  const ctx = useContext(CalendarContext);
  if (!ctx) return null;

  const { addEvent } = ctx;

  const handleSubmit = () => {
    if (!title.trim()) return;
    // merge date + time into a Date
    const [hoursStr, minutesStr] = time.split(":");
    const newDate = new Date(date);
    newDate.setHours(Number(hoursStr || 0), Number(minutesStr || 0), 0, 0);

    addEvent({
      id: Date.now(),
      title: title.trim(),
      date: newDate,
    });

    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-96">
        <h2 className="text-lg font-semibold mb-2">Add Event</h2>
        <p className="text-sm text-gray-500 mb-2">{date.toDateString()}</p>

        <input
          className="border rounded w-full p-2 mb-3"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex gap-2 mb-3">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border rounded p-2"
          />
          {/* Later: add select for calendar, color, duration */}
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
