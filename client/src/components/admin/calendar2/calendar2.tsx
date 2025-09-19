// import React, { useContext } from "react"
// import dayjs, { Dayjs } from "dayjs"
// import Sidebar from "./Sidebar"
// import CalendarHeader from "./CalendarHeader"
// import { calendarContext } from "./calendarContext";

// // Define types for props
// interface DayProps {
//   day: Dayjs;
//   rowIdx: number;
// }

// interface MonthProps {
//   month: Dayjs[][];
// }

// const Calendar2: React.FC = () => {

//   // Get the context and handle the case when it's null
//   const context = useContext(calendarContext);

//   if (!context) {
//     // Handle the case when context is null (e.g., return a loading state or error)
//     return <div>Loading...</div>;
//   }

//   const { currentMonth } = context;


//   return (
//     <div className="h-[calc(100vh-4rem)] flex flex-col">
//       <CalendarHeader />
//       <div className="flex flex-1">
//         <Sidebar />
//         <Month month={currentMonth} />
//       </div>
//     </div>
//   )
// }

// export default Calendar2

// // Month component
// const Month: React.FC<MonthProps> = ({ month }) => {
//   return (
//     <div className='flex-1 grid grid-cols-7 '>
//       {month.map((row, i) => (
//         <React.Fragment key={i}>
//           {row.map((day, idx) => (
//              <Day day={day} rowIdx={i} key={idx} />
//           ))}
//         </React.Fragment>
//       ))}
//     </div>
//   )
// }

// // Day component
// const Day: React.FC<DayProps> = ({ day, rowIdx }) => {

//   function getCurrentDayClass(): string {
//     return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
//       ? "bg-blue-600 text-white rounded-full w-7"
//       : ""
//   }

//   function bgColorChange(): string {
//     return day.format("MM") === dayjs().format("MM") ? "" : "bg-gray-200"
//   }

//   return (
//     <div className={`border border-gray-200 flex flex-col ${bgColorChange()}`}>
//       <header className={`flex flex-col items-center`}>
//         {rowIdx === 0 && (<p>{day.format("ddd").toUpperCase()}</p>)}
//         <p className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}>
//           {day.format("DD")}
//         </p>
//       </header>
//     </div>
//   )
// }







import React, { useContext, useState } from "react";
import { calendarContext } from "./calendarContext";
import CalendarHeader from "./CalendarHeader";
import Sidebar from "./Sidebar";

const Calendar2: React.FC = () => {
  const ctx = useContext(calendarContext);
  if (!ctx) return <div>Loading...</div>;

  const { currentMonth } = ctx;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <CalendarHeader />
      <div className="flex flex-1">
        <Sidebar />
        <Month month={currentMonth} />
      </div>
    </div>
  );
};

export default Calendar2;

interface MonthProps {
  month: Date[][];
}

const Month: React.FC<MonthProps> = ({ month }) => (
  <div className="flex-1 grid grid-cols-7">
    {month.map((row, i) => (
      <React.Fragment key={i}>
        {row.map((day, idx) => (
          <Day key={idx} day={day} rowIdx={i} />
        ))}
      </React.Fragment>
    ))}
  </div>
);


interface DayProps {
  day: Date;
  rowIdx: number;
}




// AddEventModal.tsx
interface AddEventModalProps {
  date: Date;
  onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ date, onClose }) => {
  const ctx = useContext(calendarContext);
  if (!ctx) return null;

  const { addEvent } = ctx;
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      addEvent({ id: Date.now(), title, date });
      setTitle("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md shadow-md w-80">
        <h2 className="text-lg font-semibold mb-2">Add Event</h2>
        <p className="text-sm text-gray-500 mb-2">{date.toDateString()}</p>
        <input
          className="border rounded w-full p-2 mb-3"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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






const Day: React.FC<DayProps> = ({ day, rowIdx }) => {
  const [showModal, setShowModal] = useState(false)
  const ctx = useContext(calendarContext);
  if (!ctx) return null;

  const { monthIndex, year, events } = ctx;
  const today = new Date();

  const isToday =
    day.getDate() === today.getDate() &&
    day.getMonth() === today.getMonth() &&
    day.getFullYear() === today.getFullYear();

  const isCurrentMonth = day.getMonth() === monthIndex && day.getFullYear() === year;
  const isSunday = day.getDay() === 0; // Sunday = 0
  const weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weekday = weekdayNames[day.getDay()];

  // Filter events for this day
  const dayEvents = events.filter(
    (e) =>
      e.date.getDate() === day.getDate() &&
      e.date.getMonth() === day.getMonth() &&
      e.date.getFullYear() === day.getFullYear()
  );

  return (
    <div className={`border border-gray-200 flex flex-col hover:bg-blue-100 ${isCurrentMonth ? "bg-white" : "bg-transparent"}`}
    onClick={() => setShowModal(true)}>
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <div className="bg-gray-400 w-full flex items-center justify-center h-6">
            <p className={`text-xs font-bold ${weekday === "SUN" && "text-red-800"}`}>
              {weekday}
            </p>
          </div>
        )}
        <p
          className={`text-sm p-1 my-1 text-center ${isToday ? "bg-blue-600 text-white rounded-full w-7" : ""
            } ${isSunday ? "text-red-500 font-medium" : ""}`}
        >
          {day.getDate()}
        </p>
      </header>

      {/* Events */}
      <div className="flex flex-col items-start px-1">
        {dayEvents.map((event) => (
          <span
            key={event.id}
            className="bg-blue-100 text-blue-800 text-xs px-1 rounded truncate w-full"
          >
            {event.title}
          </span>
        ))}
      </div>

      {showModal && (
        <AddEventModal date={day} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};









