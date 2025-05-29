// Calendar.js
import React, { useState, useEffect } from "react";

const Calendar3 = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Helper function to get the first day of the month
  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  };

  // Helper function to get the last day of the month
  const getLastDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  };

  // Get the current month's calendar days
  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth();
    const lastDay = getLastDayOfMonth();
    const daysInMonth = [];

    // Add empty slots for previous month's days
    for (let i = 0; i < firstDay.getDay(); i++) {
      daysInMonth.push(null);
    }

    // Add the days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysInMonth.push(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      );
    }

    return daysInMonth;
  };

  // Handle month navigation
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Open the event modal
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // Handle event creation
  const handleAddEvent = (event) => {
    setEvents([...events, event]);
    setShowModal(false);
  };

  return (
    <div>
      <div className="calendar-nav">
        <button onClick={() => changeMonth(-1)}>Previous</button>
        <h2>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={() => changeMonth(1)}>Next</button>
      </div>

      <div className="calendar-grid">
        {generateCalendarDays().map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day ? "" : "empty"}`}
            onClick={() => day && handleDateClick(day)}
          >
            {day ? day.getDate() : ""}
            {events
              .filter(
                (event) => event.date.toDateString() === day?.toDateString()
              )
              .map((event, idx) => (
                <div key={idx} className="event">
                  {event.title}
                </div>
              ))}
          </div>
        ))}
      </div>

      {showModal && (
        <EventModal
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          onAddEvent={handleAddEvent}
        />
      )}
    </div>
  );
};

export default Calendar3;

const EventModal = ({ selectedDate, onClose, onAddEvent }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { title, date: selectedDate };
    onAddEvent(newEvent);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Event on {selectedDate.toLocaleDateString()}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            required
          />
          <button type="submit">Add Event</button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};
