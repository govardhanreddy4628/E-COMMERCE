import React, { useContext } from "react";
import { CalendarContext } from "./calendarContext";

interface MonthProps {
  month: Date[][];
  onDayClick: (date: Date) => void;
}

export const Month: React.FC<MonthProps> = ({ month, onDayClick }) => (
  <div className="flex-1 grid grid-cols-7">
    {month.map((row, i) => (
      <React.Fragment key={i}>
        {row.map((day, idx) => (
          <Day key={idx} day={day} rowIdx={i} onClick={() => onDayClick(day)} />
        ))}
      </React.Fragment>
    ))}
  </div>
);

interface DayProps {
  day: Date;
  rowIdx: number;
  onClick: () => void;
}

const Day: React.FC<DayProps> = ({ day, onClick }) => {
  const ctx = useContext(CalendarContext);
  if (!ctx) return null;
  const { monthIndex, events } = ctx;

  const isThisMonth = day.getMonth() === monthIndex;
  const today = new Date();
  const isToday =
    day.getFullYear() === today.getFullYear() &&
    day.getMonth() === today.getMonth() &&
    day.getDate() === today.getDate();

  const todaysEvents = events.filter(
    (ev) =>
      ev.date.getFullYear() === day.getFullYear() &&
      ev.date.getMonth() === day.getMonth() &&
      ev.date.getDate() === day.getDate()
  );

  return (
    <div
      onClick={onClick}
      className={`border p-2 min-h-[80px] cursor-pointer ${
        isThisMonth ? "bg-white" : "bg-gray-50"
      } ${isToday ? "ring-2 ring-blue-300" : ""}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium">{day.getDate()}</div>
      </div>

      <div className="flex flex-col gap-1">
        {todaysEvents.slice(0, 3).map((ev) => (
          <div key={ev.id} className="text-xs truncate rounded px-1 py-0.5 bg-blue-100">
            {ev.title}
          </div>
        ))}
        {todaysEvents.length > 3 && (
          <div className="text-xs text-gray-500">
            +{todaysEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};
