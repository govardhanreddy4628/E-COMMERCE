import React, { createContext, ReactNode, useState } from "react";


export interface EventItem {
  id: number;
  title: string;
  date: Date;
  // optional: time, description, color, etc.
}

export type Duration = "day" | "week" | "month" | "year";

export interface CalendarContextType {
  currentMonth: Date[][];
  monthIndex: number;
  year: number;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToNextWeek: () => void;
  goToPrevWeek: () => void;
  resetToToday: () => void;
  events: EventItem[];
  addEvent: (event: EventItem) => void;
  duration: Duration;
  setDuration: (d: Duration) => void;
  // helper: getMatrixForMonth etc can be added later
}

export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

/* ---------- Utilities ---------- */

function startOfWeek(date: Date, weekStartsOn = 0) {
  // weekStartsOn: 0 = Sunday
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + weekStartsOn;
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

function cloneDate(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/* ---------- Month matrix generator ---------- */
function getMonthMatrix(month = new Date().getMonth(), year = new Date().getFullYear()): Date[][] {
  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekday = firstDayOfMonth.getDay(); // 0 = Sun, 6 = Sat

  // Last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const lastDate = lastDayOfMonth.getDate();

  // Total cells needed
  const totalCells = firstWeekday + lastDate;
  const weeks = Math.ceil(totalCells / 7); // 5 or 6 weeks

  let currentDay = 1 - firstWeekday; // backfill prev month days

  const daysMatrix: Date[][] = Array.from({ length: weeks }, () =>
    Array.from({ length: 7 }, () => {
      const date = new Date(year, month, currentDay);
      currentDay++;
      return date;
    })
  );

  return daysMatrix;
}

/* ---------- Provider ---------- */

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const today = new Date();
  const [monthIndex, setMonthIndex] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<Date[][]>(getMonthMatrix(monthIndex, year));
  const [events, setEvents] = useState<EventItem[]>([]);
  const [duration, setDuration] = useState<Duration>("month");

  // Keep currentMonth in sync when monthIndex/year changes via helper updateMonth
  const updateMonth = (m: number, y: number) => {
    setMonthIndex(m);
    setYear(y);
    setCurrentMonth(getMonthMatrix(m, y));
  };

  const goToNextMonth = () => {
    let nextMonth = monthIndex + 1;
    let nextYear = year;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }
    updateMonth(nextMonth, nextYear);
  };

  const goToPrevMonth = () => {
    let prevMonth = monthIndex - 1;
    let prevYear = year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    updateMonth(prevMonth, prevYear);
  };

  // Week navigation - moves the calendar's currentMonth matrix so that the first row corresponds to the week moved to.
  // We'll implement a simple week navigation that shifts the displayed month matrix by 7 days around the currently visible first day.
  const goToNextWeek = () => {
    // move the matrix forward by 7 days
    const firstShown = currentMonth[0][0];
    const newFirst = new Date(firstShown);
    newFirst.setDate(newFirst.getDate() + 7);
    const m = newFirst.getMonth();
    const y = newFirst.getFullYear();
    setMonthIndex(m);
    setYear(y);
    setCurrentMonth(getMonthMatrix(m, y));
  };

  const goToPrevWeek = () => {
    const firstShown = currentMonth[0][0];
    const newFirst = new Date(firstShown);
    newFirst.setDate(newFirst.getDate() - 7);
    const m = newFirst.getMonth();
    const y = newFirst.getFullYear();
    setMonthIndex(m);
    setYear(y);
    setCurrentMonth(getMonthMatrix(m, y));
  };

  const resetToToday = () => {
    updateMonth(today.getMonth(), today.getFullYear());
    setDuration("month");
  };

  const addEvent = (event: EventItem) => {
    // ensure date is a Date object (defensive)
    const normalized = { ...event, date: cloneDate(new Date(event.date)) };
    setEvents((prev) => [...prev, normalized]);
  };

  const ctxValue: CalendarContextType = {
    currentMonth,
    monthIndex,
    year,
    goToNextMonth,
    goToPrevMonth,
    goToNextWeek,
    goToPrevWeek,
    resetToToday,
    events,
    addEvent,
    duration,
    setDuration,
  };

  return (
    <CalendarContext.Provider value={ctxValue}>
      {children}
    </CalendarContext.Provider>
  );
};
