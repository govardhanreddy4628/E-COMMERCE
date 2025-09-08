import { createContext, ReactNode, useState } from "react";

interface CalendarContextType {
  currentMonth: Date[][];
  monthIndex: number;
  year: number;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  resetToToday: () => void;
}

export const calendarContext = createContext<CalendarContextType | null>(null);

function getMonth(month = new Date().getMonth(), year = new Date().getFullYear()): Date[][] {
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

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const today = new Date();
  const [monthIndex, setMonthIndex] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<Date[][]>(getMonth(monthIndex, year));

  const updateMonth = (m: number, y: number) => {
    setMonthIndex(m);
    setYear(y);
    setCurrentMonth(getMonth(m, y));
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

  const resetToToday = () => {
    updateMonth(today.getMonth(), today.getFullYear());
  };

  return (
    <calendarContext.Provider
      value={{ currentMonth, monthIndex, year, goToNextMonth, goToPrevMonth, resetToToday }}
    >
      {children}
    </calendarContext.Provider>
  );
};
